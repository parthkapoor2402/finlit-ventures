import { isTataDestination, resolutionFor } from "@/lib/catalogue";
import { suggestResolution } from "@/lib/resolve";
import { RequestError } from "@/lib/errors";
import {
  ANALYTICS_EVENTS,
  HELP_FOCUSES,
  LIVING_SITUATIONS,
  NEED_STATES,
  NEED_TYPES,
  WEEK_ITEM_STATES,
  WEEK_SHAPES,
  type AnalyticsEventName,
  type AnalyticsProps,
  type HelpFocus,
  type LivingSituation,
  type NeedState,
  type NeedType,
  type TataDestination,
  type WeekItemState,
  type WeekShape,
} from "@/lib/types";
import { isIsoDate } from "@/lib/week";

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

function includes<T extends string>(list: readonly T[], value: string): value is T {
  return (list as readonly string[]).includes(value);
}

export function parseTitle(value: unknown): string {
  if (typeof value !== "string") {
    throw new RequestError(400, "Add a title.");
  }
  const title = value.trim();
  if (!title) {
    throw new RequestError(400, "Add a title.");
  }
  if (title.length > 80) {
    throw new RequestError(400, "Keep the title under 80 characters.");
  }
  return title;
}

export function parseWeekShape(value: unknown): WeekShape {
  if (typeof value !== "string" || !includes(WEEK_SHAPES, value)) {
    throw new RequestError(400, "Choose a type from the list.");
  }
  return value;
}

export function parseNeedType(value: unknown): NeedType {
  if (typeof value !== "string" || !includes(NEED_TYPES, value)) {
    throw new RequestError(400, "Choose a need type from the list.");
  }
  return value;
}

export function parseItemState(value: unknown): WeekItemState {
  if (typeof value !== "string" || !includes(WEEK_ITEM_STATES, value)) {
    throw new RequestError(400, "Choose planned or done.");
  }
  return value;
}

export function parseNeedState(value: unknown): NeedState {
  if (typeof value !== "string" || !includes(NEED_STATES, value)) {
    throw new RequestError(400, "Choose open, exploring, or resolved.");
  }
  return value;
}

export function parseDay(value: unknown, allowedDays: readonly string[]): string {
  if (typeof value !== "string" || !isIsoDate(value) || !allowedDays.includes(value)) {
    throw new RequestError(400, "Choose a day in this week.");
  }
  return value;
}

export function parseTime(value: unknown): string | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string" || !TIME_PATTERN.test(value)) {
    throw new RequestError(400, "Use a time like 09:30, or leave it blank.");
  }
  return value;
}

export function parseItemDestination(value: unknown): TataDestination | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string" || !isTataDestination(value)) {
    throw new RequestError(400, "That Tata stop is not in the demo catalogue.");
  }
  return value;
}

export function parseNote(value: unknown): string | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") {
    throw new RequestError(400, "Keep that note short.");
  }
  const note = value.trim();
  if (!note) return null;
  if (note.length > 140) {
    throw new RequestError(400, "Keep that note under 140 characters.");
  }
  return note;
}

export function parseNeedDestination(
  type: NeedType,
  title: string,
  value: unknown,
): ReturnType<typeof resolutionFor> | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string" || !isTataDestination(value)) {
    throw new RequestError(400, "That Tata stop is not in the demo catalogue.");
  }
  const suggested = suggestResolution(type, title);
  if (suggested !== value) {
    throw new RequestError(400, "That Tata stop does not fit this need.");
  }
  return resolutionFor(value);
}

export function parseLivingSituation(value: unknown): LivingSituation | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string" || !includes(LIVING_SITUATIONS, value)) {
    throw new RequestError(400, "Choose a living situation from the list.");
  }
  return value;
}

export function parseWeekShapes(value: unknown): WeekShape[] {
  if (!Array.isArray(value)) {
    throw new RequestError(400, "Choose what this week includes.");
  }
  const shapes: WeekShape[] = [];
  for (const entry of value) {
    if (typeof entry !== "string" || !includes(WEEK_SHAPES, entry)) {
      throw new RequestError(400, "Choose what this week includes.");
    }
    if (!shapes.includes(entry)) shapes.push(entry);
  }
  return shapes;
}

export function parseHelpFocuses(value: unknown): HelpFocus[] {
  if (!Array.isArray(value)) {
    throw new RequestError(400, "Choose what NeuPlan should help with.");
  }
  const focuses: HelpFocus[] = [];
  for (const entry of value) {
    if (typeof entry !== "string" || !includes(HELP_FOCUSES, entry)) {
      throw new RequestError(400, "Choose what NeuPlan should help with.");
    }
    if (!focuses.includes(entry)) focuses.push(entry);
  }
  return focuses;
}

export function parseEventName(value: unknown): AnalyticsEventName {
  if (typeof value !== "string" || !includes(ANALYTICS_EVENTS, value)) {
    throw new RequestError(400, "Unknown event.");
  }
  return value;
}

const PROP_KEYS = ["type", "state", "destination", "source", "reason"] as const;

export function parseAnalyticsProps(value: unknown): AnalyticsProps {
  if (value === undefined || value === null) return {};
  if (typeof value !== "object" || Array.isArray(value)) {
    throw new RequestError(400, "Event details must be a short list of labels.");
  }
  const props: AnalyticsProps = {};
  for (const [key, raw] of Object.entries(value)) {
    if (!includes(PROP_KEYS, key)) {
      throw new RequestError(400, "Event details must be a short list of labels.");
    }
    if (typeof raw !== "string" || raw.length > 40 || raw.includes("\n")) {
      throw new RequestError(400, "Event details must be a short list of labels.");
    }
    props[key] = raw;
  }
  return props;
}
