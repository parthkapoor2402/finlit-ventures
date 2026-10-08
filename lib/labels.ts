import type {
  HelpFocus,
  LivingSituation,
  NeedType,
  TataDestination,
  WeekShape,
} from "@/lib/types";

export const WEEK_SHAPE_LABELS: Record<WeekShape, string> = {
  classes: "Classes",
  food: "Food / groceries",
  shopping: "Shopping",
  travel: "Travel",
  fitness: "Fitness",
  events: "Events",
  study: "Assignments",
  personal: "Personal tasks",
  health: "Health",
  other: "Other",
};

export const LIVING_LABELS: Record<LivingSituation, string> = {
  with_family: "With family",
  hostel: "Hostel",
  pg: "PG",
  shared_apartment: "Shared apartment",
};

export const HELP_LABELS: Record<HelpFocus, string> = {
  see_the_week: "See this week in one place",
  hold_a_need: "Hold a need until I deal with it",
  see_a_tata_stop: "See which Tata stop could finish a need",
};

export const NEED_TYPE_LABELS: Record<NeedType, string> = {
  buy: "Buy",
  book: "Book",
  prepare: "Prepare",
  remember: "Remember",
  replace: "Replace",
  plan: "Plan",
};

export const HYPOTHESIS_LINE =
  "Qualitative prototype. Youth WAU +15% is a target, not a result.";

export function formatDayLabel(iso: string): string {
  const parts = iso.split("-");
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  if (!year || !month || !day) return iso;
  const date = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(date);
}

export function greeting(now = new Date()): string {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      hourCycle: "h23",
      timeZone: "Asia/Kolkata",
    }).format(now),
  );
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function formatClock(time: string): string {
  const [hourText, minuteText] = time.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return time;
  const date = new Date(Date.UTC(2026, 0, 1, hour, minute));
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(date);
}
