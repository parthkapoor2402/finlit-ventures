const TIME_ZONE = "Asia/Kolkata";

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export interface WeekRange {
  startsOn: string;
  endsOn: string;
  days: string[];
  timeZone: "Asia/Kolkata";
}

interface CivilDate {
  year: number;
  month: number;
  day: number;
}

export function zonedParts(now: Date, timeZone = TIME_ZONE) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  });
  const parts = fmt.formatToParts(now);
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  const weekday = WEEKDAY_INDEX[read("weekday")];
  if (weekday === undefined) {
    throw new Error("Could not read the weekday.");
  }
  return {
    year: Number(read("year")),
    month: Number(read("month")),
    day: Number(read("day")),
    weekday,
  };
}

function isoDate(date: CivilDate): string {
  const month = String(date.month).padStart(2, "0");
  const day = String(date.day).padStart(2, "0");
  return `${date.year}-${month}-${day}`;
}

function addDays(date: CivilDate, delta: number): CivilDate {
  const utc = new Date(Date.UTC(date.year, date.month - 1, date.day));
  utc.setUTCDate(utc.getUTCDate() + delta);
  return {
    year: utc.getUTCFullYear(),
    month: utc.getUTCMonth() + 1,
    day: utc.getUTCDate(),
  };
}

export function weekRange(now: Date): WeekRange {
  const zoned = zonedParts(now);
  const sinceMonday = (zoned.weekday + 6) % 7;
  const start = addDays(zoned, -sinceMonday);
  const days: string[] = [];
  for (let index = 0; index < 7; index += 1) {
    days.push(isoDate(addDays(start, index)));
  }
  const startsOn = days[0];
  const endsOn = days[6];
  if (!startsOn || !endsOn) {
    throw new Error("Could not build the week.");
  }
  return {
    startsOn,
    endsOn,
    days,
    timeZone: TIME_ZONE,
  };
}

export function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [yearText, monthText, dayText] = value.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const utc = new Date(Date.UTC(year, month - 1, day));
  return (
    utc.getUTCFullYear() === year &&
    utc.getUTCMonth() === month - 1 &&
    utc.getUTCDate() === day
  );
}
