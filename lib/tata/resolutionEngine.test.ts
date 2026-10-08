import { describe, expect, it } from "vitest";
import { resolveNeed } from "@/lib/tata/resolutionEngine";

describe("resolution engine", () => {
  it("is the only place a kept line becomes a demo stop", () => {
    expect(resolveNeed("replace", "Replace charger")).toEqual({
      destination: "croma",
      label: "Croma",
      isLive: false,
      demoOnly: true,
    });
    expect(resolveNeed("buy", "Groceries")).toMatchObject({ destination: "bigbasket", isLive: false, demoOnly: true });
    expect(resolveNeed("book", "Travel home")).toMatchObject({ destination: "travel", label: "Air India" });
    expect(resolveNeed("buy", "Buy a gift")).toMatchObject({ destination: "westside" });
  });

  it("does not shop study, a reminder, pack, or a vague buy", () => {
    expect(resolveNeed("remember", "Study")).toBeNull();
    expect(resolveNeed("remember", "A reminder")).toBeNull();
    expect(resolveNeed("remember", "USB charger")).toBeNull();
    expect(resolveNeed("prepare", "Pack")).toBeNull();
    expect(resolveNeed("plan", "A plan")).toBeNull();
    expect(resolveNeed("buy", "Buy something")).toBeNull();
  });
});
