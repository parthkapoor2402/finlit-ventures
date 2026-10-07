import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { RequestError } from "@/lib/errors";
import type {
  AIInsight,
  AnalyticsEvent,
  AnalyticsEventName,
  AnalyticsProps,
  Need,
  NeedState,
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
  parseNeedDestination,
  parseNeedState,
  parseNeedType,
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
    onboardingComplete: false,
    onboardingCompletedAt: null,
  };
}

function seedStore(): StoreFile {
  return {
    version: 1,
    user: seedUser(),
    items: [],
    needs: [],
    insight: null,
    events: [],
  };
}

async function readStore(dir: string, file: string): Promise<StoreFile> {
  try {
    const raw = await readFile(file, "utf8");
    const parsed = JSON.parse(raw) as StoreFile;
    if (parsed.version !== 1 || !parsed.user) {
      throw new RequestError(500, "We couldn't refresh your week.");
    }
    return parsed;
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
      createdAt: stamp,
      updatedAt: stamp,
    };
    data.items.push(item);
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
    if ("state" in patch) item.state = parseItemState(patch.state);
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
}

export function createNeed(input: NeedInput, now = new Date()): Promise<Need> {
  const paths = storePaths();
  return enqueue(async () => {
    const data = await readStore(paths.dir, paths.file);
    const stamp = now.toISOString();
    const need: Need = {
      id: randomUUID(),
      type: parseNeedType(input.type),
      title: parseTitle(input.title),
      state: "open",
      resolution: null,
      createdAt: stamp,
      updatedAt: stamp,
    };
    data.needs.push(need);
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
      } else {
        const destination = "tataDestination" in patch ? patch.tataDestination : need.resolution?.destination ?? null;
        need.state = "resolved";
        need.resolution = parseNeedDestination(need.type, destination);
      }
    }
    need.updatedAt = now.toISOString();
    data.insight = null;
    await writeStore(paths.file, data);
    return need;
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
