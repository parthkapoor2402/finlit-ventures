import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { RequestError } from "@/lib/errors";
import { seedDrafts } from "@/lib/seed";
import type {
  AIInsight,
  AnalyticsEvent,
  AnalyticsEventName,
  AnalyticsProps,
  Moment,
  Need,
  NeedState,
  Notice,
  StoreFile,
  User,
  Week,
  WeekItem,
} from "@/lib/types";
import {
  parseAnalyticsProps,
  parseDay,
  parseEventName,
  parseHelpFocuses,
  parseItemDestination,
  parseItemState,
  parseLivingSituation,
  parseMomentKind,
  parseNeedDestination,
  parseNeedState,
  parseNeedType,
  parseNote,
  parseTime,
  parseTitle,
  parseWeekShape,
  parseWeekShapes,
} from "@/lib/validate";
import { weekRange } from "@/lib/week";

let queue: Promise<unknown> = Promise.resolve();

function storePaths() {
  const dir = process.env.NEUPLAN_DATA_DIR ?? path.join(process.cwd(), ".data");
  return { dir, file: path.join(dir, "store.json") };
}

function seedUser(): User {
  return {
    id: "demo-ananya",
    displayName: "Ananya",
    isDemo: true,
    demoLabel: "DEMO DATA",
    livingSituation: null,
    weekShapes: [],
    helpWith: [],
    note: null,
    lastSeenAt: null,
    onboardingComplete: false,
    onboardingCompletedAt: null,
  };
}

function seedStore(): StoreFile {
  return {
    version: 2,
    user: seedUser(),
    items: [],
    moments: [],
    needs: [],
    notices: [],
    insight: null,
    events: [],
  };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function normalizeMoment(entry: unknown): Moment | null {
  const raw = asRecord(entry);
  if (!raw || typeof raw.id !== "string" || typeof raw.title !== "string") return null;
  const kind = parseMomentKindSafe(raw.kind);
  const day = typeof raw.day === "string" ? raw.day : null;
  const start = typeof raw.start === "string" ? raw.start : day;
  const createdAt = typeof raw.createdAt === "string" ? raw.createdAt : new Date(0).toISOString();
  return {
    id: raw.id,
    title: raw.title,
    kind,
    day,
    start,
    status: raw.status === "done" ? "done" : "open",
    createdAt,
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : createdAt,
  };
}

function parseMomentKindSafe(value: unknown): Moment["kind"] {
  try {
    return parseMomentKind(value);
  } catch {
    return "other";
  }
}

function normalizeStore(raw: unknown): StoreFile {
  const parsed = asRecord(raw);
  const userRaw = parsed ? asRecord(parsed.user) : null;
  if (!parsed || !userRaw || (parsed.version !== 1 && parsed.version !== 2)) {
    throw new RequestError(500, "We couldn't refresh your week.");
  }
  const base = seedUser();
  const user: User = {
    ...base,
    ...userRaw,
    id: "demo-ananya",
    displayName: "Ananya",
    isDemo: true,
    demoLabel: "DEMO DATA",
    note: typeof userRaw.note === "string" ? userRaw.note : null,
    lastSeenAt: typeof userRaw.lastSeenAt === "string" ? userRaw.lastSeenAt : null,
  };
  const items = Array.isArray(parsed.items)
    ? parsed.items.map((entry) => {
        const item = entry as WeekItem;
        return { ...item, source: item.source === "seed" ? "seed" : "user" } as WeekItem;
      })
    : [];
  const needs = Array.isArray(parsed.needs)
    ? parsed.needs.map((entry) => {
        const need = entry as Need;
        return {
          ...need,
          momentId: typeof need.momentId === "string" ? need.momentId : null,
          day: typeof need.day === "string" ? need.day : null,
          time: typeof need.time === "string" ? need.time : null,
          source: need.source === "seed" ? "seed" : "user",
        } as Need;
      })
    : [];
  const moments = Array.isArray(parsed.moments)
    ? parsed.moments.flatMap((entry) => {
        const moment = normalizeMoment(entry);
        return moment ? [moment] : [];
      })
    : [];
  const notices = Array.isArray(parsed.notices) ? (parsed.notices as Notice[]) : [];
  return {
    version: 2,
    user,
    items,
    moments,
    needs,
    notices,
    insight: (parsed.insight as AIInsight | null) ?? null,
    events: Array.isArray(parsed.events) ? (parsed.events as AnalyticsEvent[]) : [],
  };
}

async function readStore(dir: string, file: string): Promise<StoreFile> {
  try {
    const raw = await readFile(file, "utf8");
    return normalizeStore(JSON.parse(raw) as unknown);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      const seed = seedStore();
      await mkdir(dir, { recursive: true });
      await writeFile(file, JSON.stringify(seed, null, 2));
      return seed;
    }
    if (error instanceof RequestError) throw error;
    throw new RequestError(500, "We couldn't refresh your week.");
  }
}

async function writeStore(file: string, data: StoreFile): Promise<void> {
  const temporary = `${file}.tmp`;
  await writeFile(temporary, JSON.stringify(data, null, 2));
  await rename(temporary, file);
}

function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function compareItems(a: WeekItem, b: WeekItem): number {
  if (a.day !== b.day) return a.day < b.day ? -1 : 1;
  const left = a.time ?? "99:99";
  const right = b.time ?? "99:99";
  if (left !== right) return left < right ? -1 : 1;
  return a.createdAt < b.createdAt ? -1 : 1;
}

function buildWeek(data: StoreFile, now: Date): Week {
  const range = weekRange(now);
  const items = data.items
    .filter((item) => range.days.includes(item.day))
    .sort(compareItems);
  return {
    id: `week-${range.startsOn}`,
    startsOn: range.startsOn,
    endsOn: range.endsOn,
    timeZone: range.timeZone,
    days: range.days,
    items,
  };
}

export function getWeek(now = new Date()): Promise<Week> {
  const paths = storePaths();
  return enqueue(async () => {
    const data = await readStore(paths.dir, paths.file);
    return buildWeek(data, now);
  });
}

export function getUser(): Promise<User> {
  const paths = storePaths();
  return enqueue(async () => {
    const data = await readStore(paths.dir, paths.file);
    return data.user;
  });
}

export interface UserUpdate {
  livingSituation?: unknown;
  weekShapes?: unknown;
  helpWith?: unknown;
  note?: unknown;
  onboardingComplete?: unknown;
}

export function updateUser(input: UserUpdate, now = new Date()): Promise<User> {
  const paths = storePaths();
  return enqueue(async () => {
    const data = await readStore(paths.dir, paths.file);
    const next: User = { ...data.user };
    if ("livingSituation" in input) {
      next.livingSituation = parseLivingSituation(input.livingSituation);
    }
    if ("weekShapes" in input) {
      next.weekShapes = parseWeekShapes(input.weekShapes);
    }
    if ("helpWith" in input) {
      next.helpWith = parseHelpFocuses(input.helpWith);
    }
    if ("note" in input) {
      next.note = parseNote(input.note);
    }
    if ("onboardingComplete" in input) {
      if (typeof input.onboardingComplete !== "boolean") {
        throw new RequestError(400, "Onboarding could not be saved.");
      }
      if (input.onboardingComplete) {
        if (!next.livingSituation || next.weekShapes.length === 0 || next.helpWith.length === 0) {
          throw new RequestError(400, "Choose the week, where you live, and what NeuPlan should help with.");
        }
        next.onboardingComplete = true;
        next.onboardingCompletedAt = data.user.onboardingCompletedAt ?? now.toISOString();
        if (!data.user.onboardingComplete && data.items.length === 0 && data.needs.length === 0) {
          const range = weekRange(now);
          const seeded = seedDrafts(next.weekShapes, next.note);
          const stamp = now.toISOString();
          for (const draft of seeded.items) {
            const day = range.days[draft.dayIndex] ?? range.days[0];
            if (!day) continue;
            data.items.push({
              id: randomUUID(),
              type: draft.type,
              title: draft.title,
              day,
              time: draft.time,
              state: "planned",
              tataDestination: null,
              source: "seed",
              createdAt: stamp,
              updatedAt: stamp,
            });
          }
          for (const draft of seeded.needs) {
            const day = range.days[draft.dayIndex] ?? range.days[0] ?? null;
            data.needs.push({
              id: randomUUID(),
              momentId: null,
              type: draft.type,
              title: draft.title,
              day,
              time: null,
              state: "open",
              resolution: null,
              source: "seed",
              createdAt: stamp,
              updatedAt: stamp,
            });
          }
        }
      } else {
        next.onboardingComplete = false;
        next.onboardingCompletedAt = null;
      }
    }
    data.user = next;
    await writeStore(paths.file, data);
    return next;
  });
}

export interface ItemInput {
  type: unknown;
  title: unknown;
  day: unknown;
  time?: unknown;
  tataDestination?: unknown;
}

export function createItem(input: ItemInput, now = new Date()): Promise<WeekItem> {
  const paths = storePaths();
  return enqueue(async () => {
    const data = await readStore(paths.dir, paths.file);
    const range = weekRange(now);
    const stamp = now.toISOString();
    const item: WeekItem = {
      id: randomUUID(),
      type: parseWeekShape(input.type),
      title: parseTitle(input.title),
      day: parseDay(input.day, range.days),
      time: parseTime(input.time),
      state: "planned",
      tataDestination: parseItemDestination(input.tataDestination),
      source: "user",
      createdAt: stamp,
      updatedAt: stamp,
    };
    data.items.push(item);
    data.notices.unshift({
      id: randomUUID(),
      text: `Added: ${item.title}`,
      at: stamp,
      seen: false,
    });
    data.insight = null;
    await writeStore(paths.file, data);
    return item;
  });
}

export interface ItemPatch {
  type?: unknown;
  title?: unknown;
  day?: unknown;
  time?: unknown;
  state?: unknown;
  tataDestination?: unknown;
}

export function updateItem(id: string, patch: ItemPatch, now = new Date()): Promise<WeekItem> {
  const paths = storePaths();
  return enqueue(async () => {
    const data = await readStore(paths.dir, paths.file);
    const item = data.items.find((entry) => entry.id === id);
    if (!item) throw new RequestError(404, "That item is no longer in the week.");
    const range = weekRange(now);
    if ("type" in patch) item.type = parseWeekShape(patch.type);
    if ("title" in patch) item.title = parseTitle(patch.title);
    if ("day" in patch) item.day = parseDay(patch.day, range.days);
    if ("time" in patch) item.time = parseTime(patch.time);
    if ("state" in patch) {
      const nextState = parseItemState(patch.state);
      if (nextState === "done" && item.state !== "done") {
        data.notices.unshift({
          id: randomUUID(),
          text: `Marked done: ${item.title}`,
          at: now.toISOString(),
          seen: false,
        });
      }
      item.state = nextState;
    }
    if ("tataDestination" in patch) {
      item.tataDestination = parseItemDestination(patch.tataDestination);
    }
    item.updatedAt = now.toISOString();
    data.insight = null;
    await writeStore(paths.file, data);
    return item;
  });
}

export function deleteItem(id: string): Promise<WeekItem> {
  const paths = storePaths();
  return enqueue(async () => {
    const data = await readStore(paths.dir, paths.file);
    const index = data.items.findIndex((entry) => entry.id === id);
    if (index < 0) throw new RequestError(404, "That item is no longer in the week.");
    const [removed] = data.items.splice(index, 1);
    if (!removed) throw new RequestError(404, "That item is no longer in the week.");
    data.insight = null;
    await writeStore(paths.file, data);
    return removed;
  });
}

export function listNeeds(): Promise<Need[]> {
  const paths = storePaths();
  return enqueue(async () => {
    const data = await readStore(paths.dir, paths.file);
    return [...data.needs].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  });
}

export interface NeedInput {
  type: unknown;
  title: unknown;
  day?: unknown;
  time?: unknown;
}

export function createNeed(input: NeedInput, now = new Date()): Promise<Need> {
  const paths = storePaths();
  return enqueue(async () => {
    const data = await readStore(paths.dir, paths.file);
    const stamp = now.toISOString();
    const range = weekRange(now);
    const need: Need = {
      id: randomUUID(),
      momentId: null,
      type: parseNeedType(input.type),
      title: parseTitle(input.title),
      day: input.day === undefined || input.day === null || input.day === "" ? null : parseDay(input.day, range.days),
      time: parseTime(input.time),
      state: "open",
      resolution: null,
      source: "user",
      createdAt: stamp,
      updatedAt: stamp,
    };
    data.needs.push(need);
    data.notices.unshift({
      id: randomUUID(),
      text: `New need: ${need.title}`,
      at: stamp,
      seen: false,
    });
    data.insight = null;
    await writeStore(paths.file, data);
    return need;
  });
}

export interface NeedPatch {
  title?: unknown;
  state?: unknown;
  tataDestination?: unknown;
}

export function updateNeed(id: string, patch: NeedPatch, now = new Date()): Promise<Need> {
  const paths = storePaths();
  return enqueue(async () => {
    const data = await readStore(paths.dir, paths.file);
    const need = data.needs.find((entry) => entry.id === id);
    if (!need) throw new RequestError(404, "That need is no longer here.");
    if ("title" in patch) need.title = parseTitle(patch.title);
    const nextState: NeedState = "state" in patch ? parseNeedState(patch.state) : need.state;
    if ("tataDestination" in patch || "state" in patch) {
      if (nextState === "open") {
        if ("tataDestination" in patch && patch.tataDestination) {
          throw new RequestError(400, "Resolve the need before choosing a Tata stop.");
        }
        need.state = "open";
        need.resolution = null;
      } else if (nextState === "exploring") {
        const destination = "tataDestination" in patch ? patch.tataDestination : need.resolution?.destination ?? null;
        const resolution = parseNeedDestination(need.type, need.title, destination);
        if (!resolution) {
          throw new RequestError(400, "That Tata stop does not fit this need.");
        }
        need.state = "exploring";
        need.resolution = resolution;
        data.notices.unshift({
          id: randomUUID(),
          text: `Exploring ${resolution.label} for ${need.title}`,
          at: now.toISOString(),
          seen: false,
        });
      } else {
        const destination = "tataDestination" in patch ? patch.tataDestination : null;
        need.state = "resolved";
        need.resolution = parseNeedDestination(need.type, need.title, destination);
        data.notices.unshift({
          id: randomUUID(),
          text: `Done: ${need.title}`,
          at: now.toISOString(),
          seen: false,
        });
      }
    }
    need.updatedAt = now.toISOString();
    if (need.momentId) {
      const moment = data.moments.find((entry) => entry.id === need.momentId);
      const related = data.needs.filter((entry) => entry.momentId === need.momentId);
      if (moment && related.length > 0) {
        const finished = related.every((entry) => entry.state === "resolved");
        moment.status = finished ? "done" : "open";
        moment.updatedAt = now.toISOString();
      }
    }
    data.insight = null;
    await writeStore(paths.file, data);
    return need;
  });
}

export interface MomentLineInput {
  title: unknown;
  type: unknown;
}

export interface MomentInput {
  title: unknown;
  kind: unknown;
  day?: unknown;
  lines: unknown;
}

export function listMoments(): Promise<Moment[]> {
  const paths = storePaths();
  return enqueue(async () => {
    const data = await readStore(paths.dir, paths.file);
    return [...data.moments].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  });
}

function sameNeed(left: string, right: string): boolean {
  return left.trim().toLowerCase() === right.trim().toLowerCase();
}

export function createMoment(
  input: MomentInput,
  now = new Date(),
): Promise<{ moment: Moment; needs: Need[] }> {
  const paths = storePaths();
  return enqueue(async () => {
    const data = await readStore(paths.dir, paths.file);
    if (!Array.isArray(input.lines) || input.lines.length === 0 || input.lines.length > 6) {
      throw new RequestError(400, "Confirm at least one line.");
    }
    const range = weekRange(now);
    const stamp = now.toISOString();
    const day =
      input.day === undefined || input.day === null || input.day === ""
        ? null
        : parseDay(input.day, range.days);
    const title = parseTitle(input.title);
    const draft: Moment = {
      id: randomUUID(),
      title,
      kind: parseMomentKind(input.kind),
      day,
      start: day,
      status: "open",
      createdAt: stamp,
      updatedAt: stamp,
    };
    const openMatch = data.moments.find((entry) => entry.status === "open" && sameNeed(entry.title, title));
    const owner = openMatch ?? draft;
    const created: Need[] = [];
    const ordered: Need[] = [];
    for (const line of input.lines) {
      const record = asRecord(line);
      if (!record) throw new RequestError(400, "Confirm at least one line.");
      const lineTitle = parseTitle(record.title);
      const existing = data.needs.find((entry) => {
        if (entry.state === "resolved" || entry.momentId !== owner.id || !sameNeed(entry.title, lineTitle)) {
          return false;
        }
        return true;
      });
      if (existing) {
        ordered.push(existing);
        continue;
      }
      const need: Need = {
        id: randomUUID(),
        momentId: owner.id,
        type: parseNeedType(record.type),
        title: lineTitle,
        day,
        time: null,
        state: "open",
        resolution: null,
        source: "user",
        createdAt: stamp,
        updatedAt: stamp,
      };
      created.push(need);
      ordered.push(need);
    }
    if (created.length === 0) {
      if (!openMatch) throw new RequestError(409, "That need is already open.");
      return { moment: openMatch, needs: ordered };
    }
    if (!openMatch) data.moments.push(owner);
    else owner.updatedAt = stamp;
    data.needs.push(...created);
    data.notices.unshift({
      id: randomUUID(),
      text: openMatch ? `Added: ${created.map((need) => need.title).join(", ")}` : `Added: ${owner.title}`,
      at: stamp,
      seen: false,
    });
    data.insight = null;
    await writeStore(paths.file, data);
    return { moment: owner, needs: ordered };
  });
}

export function listEvents(): Promise<AnalyticsEvent[]> {
  const paths = storePaths();
  return enqueue(async () => {
    const data = await readStore(paths.dir, paths.file);
    return [...data.events].sort((a, b) => (a.at < b.at ? 1 : -1));
  });
}

export function recordEvent(
  name: unknown,
  props: unknown,
  now = new Date(),
): Promise<AnalyticsEvent> {
  const paths = storePaths();
  return enqueue(async () => {
    const eventName: AnalyticsEventName = parseEventName(name);
    const eventProps: AnalyticsProps = parseAnalyticsProps(props);
    const data = await readStore(paths.dir, paths.file);
    const event: AnalyticsEvent = {
      id: randomUUID(),
      name: eventName,
      props: eventProps,
      at: now.toISOString(),
    };
    data.events.push(event);
    await writeStore(paths.file, data);
    return event;
  });
}

export function listItems(): Promise<WeekItem[]> {
  const paths = storePaths();
  return enqueue(async () => {
    const data = await readStore(paths.dir, paths.file);
    return [...data.items].sort(compareItems);
  });
}

export function getInsight(): Promise<AIInsight | null> {
  const paths = storePaths();
  return enqueue(async () => {
    const data = await readStore(paths.dir, paths.file);
    return data.insight;
  });
}

export function saveInsight(insight: AIInsight): Promise<AIInsight> {
  const paths = storePaths();
  return enqueue(async () => {
    const data = await readStore(paths.dir, paths.file);
    data.insight = insight;
    await writeStore(paths.file, data);
    return insight;
  });
}

export function readStoreSnapshot(): Promise<StoreFile> {
  const paths = storePaths();
  return enqueue(() => readStore(paths.dir, paths.file));
}

export function listNotices(): Promise<Notice[]> {
  const paths = storePaths();
  return enqueue(async () => {
    const data = await readStore(paths.dir, paths.file);
    return data.notices.filter((notice) => !notice.seen);
  });
}

export function dismissNotices(): Promise<void> {
  const paths = storePaths();
  return enqueue(async () => {
    const data = await readStore(paths.dir, paths.file);
    for (const notice of data.notices) notice.seen = true;
    await writeStore(paths.file, data);
  });
}

export function acknowledgeVisit(now = new Date()): Promise<{ returning: boolean }> {
  const paths = storePaths();
  return enqueue(async () => {
    const data = await readStore(paths.dir, paths.file);
    const previous = data.user.lastSeenAt ? Date.parse(data.user.lastSeenAt) : Number.NaN;
    const returning = Number.isFinite(previous) && now.getTime() - previous > 5 * 60 * 1000;
    data.user.lastSeenAt = now.toISOString();
    await writeStore(paths.file, data);
    return { returning };
  });
}
