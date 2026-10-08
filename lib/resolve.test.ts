import { describe, expect, it } from "vitest";
import { suggestResolution } from "@/lib/resolve";

describe("suggestResolution", () => {
  it("maps a charger to Croma and leaves an assignment alone", () => {
    expect(suggestResolution("replace", "Replace charger")).toBe("croma");
    expect(suggestResolution("buy", "USB charger")).toBe("croma");
    expect(suggestResolution("remember", "Submit assignment")).toBeNull();
    expect(suggestResolution("buy", "Notebook")).toBeNull();
  });

  it("maps groceries, medicine, travel, and a gift without crossing them", () => {
    expect(suggestResolution("buy", "Groceries for the week")).toBe("bigbasket");
    expect(suggestResolution("buy", "Pick up medicine")).toBe("tata_1mg");
    expect(suggestResolution("book", "Travel home")).toBe("travel");
    expect(suggestResolution("buy", "Birthday gift")).toBe("westside");
    expect(suggestResolution("remember", "Call home")).toBeNull();
    expect(suggestResolution("buy", "Gold necklace")).toBe("tanishq");
    expect(suggestResolution("buy", "Watch")).toBe("titan");
    expect(suggestResolution("buy", "Cake")).toBe("qmin");
  });
});
