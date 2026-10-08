import { describe, expect, it } from "vitest";
import { seedDrafts } from "@/lib/seed";

describe("seedDrafts", () => {
  it("builds a week from picks and does not shop an assignment", () => {
    const seeded = seedDrafts(["classes", "study", "shopping", "travel"], null);
    expect(seeded.items.map((item) => item.title)).toEqual(["Classes", "Assignment due"]);
    expect(seeded.needs.map((need) => need.title)).toEqual(["Replace charger", "Travel home"]);
    expect(seeded.items.find((item) => item.title === "Assignment due")?.type).toBe("study");
  });

  it("uses the note instead of a blank other", () => {
    const seeded = seedDrafts(["other"], "Need a charger");
    expect(seeded.needs).toEqual([{ type: "replace", title: "Need a charger", dayIndex: 6 }]);
  });
});
