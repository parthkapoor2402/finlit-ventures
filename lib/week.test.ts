import { describe, expect, it } from "vitest";
import { isIsoDate, weekRange } from "@/lib/week";

describe("weekRange", () => {
  it("starts on Monday for Wednesday 7 October 2026 in India", () => {
    const range = weekRange(new Date("2026-10-07T12:00:00+05:30"));
    expect(range.timeZone).toBe("Asia/Kolkata");
    expect(range.startsOn).toBe("2026-10-05");
    expect(range.endsOn).toBe("2026-10-11");
    expect(range.days).toEqual([
      "2026-10-05",
      "2026-10-06",
      "2026-10-07",
      "2026-10-08",
      "2026-10-09",
      "2026-10-10",
      "2026-10-11",
    ]);
  });

  it("keeps late Sunday in the week that is ending", () => {
    const range = weekRange(new Date("2026-10-11T23:30:00+05:30"));
    expect(range.startsOn).toBe("2026-10-05");
  });

  it("starts a new week on Monday morning", () => {
    const range = weekRange(new Date("2026-10-05T00:30:00+05:30"));
    expect(range.startsOn).toBe("2026-10-05");
    expect(range.endsOn).toBe("2026-10-11");
  });

  it("puts the previous Sunday in the previous week", () => {
    const range = weekRange(new Date("2026-10-04T23:00:00+05:30"));
    expect(range.startsOn).toBe("2026-09-28");
    expect(range.endsOn).toBe("2026-10-04");
  });
});

describe("isIsoDate", () => {
  it("rejects a calendar date that does not exist", () => {
    expect(isIsoDate("2026-02-31")).toBe(false);
    expect(isIsoDate("2026-10-07")).toBe(true);
  });
});
