import { describe, expect, it } from "vitest";
import { formatClock, formatDayLabel, HYPOTHESIS_LINE } from "@/lib/labels";

describe("labels", () => {
  it("formats a day without shifting the calendar date", () => {
    expect(formatDayLabel("2026-10-07")).toMatch(/7/);
    expect(formatDayLabel("2026-10-07")).toMatch(/Oct/);
  });

  it("formats a 24-hour time for display", () => {
    expect(formatClock("09:05").toLowerCase()).toContain("9");
    expect(formatClock("09:05")).toContain("05");
  });

  it("states the WAU line as a target", () => {
    expect(HYPOTHESIS_LINE).toContain("target");
    expect(HYPOTHESIS_LINE).toContain("+15%");
    expect(HYPOTHESIS_LINE.toLowerCase()).not.toContain("achieved");
  });
});
