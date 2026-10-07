import { describe, expect, it } from "vitest";
import {
  catalogueEntry,
  destinationAllowedForNeed,
  listCatalogue,
} from "@/lib/catalogue";
import { TATA_DESTINATIONS } from "@/lib/types";

describe("demo catalogue", () => {
  it("lists only the seven Tata stops, all marked demo and not live", () => {
    const entries = listCatalogue();
    expect(entries.map((entry) => entry.destination)).toEqual([...TATA_DESTINATIONS]);
    for (const entry of entries) {
      expect(entry.isLive).toBe(false);
      expect(entry.demoOnly).toBe(true);
      expect(entry.note.toLowerCase()).not.toContain("₹");
      expect(entry.note.toLowerCase()).not.toContain("only ");
    }
  });

  it("refuses a destination that is not in the catalogue", () => {
    expect(destinationAllowedForNeed("buy", "croma")).toBe(true);
    expect(destinationAllowedForNeed("buy", "neu_upi")).toBe(false);
    expect(destinationAllowedForNeed("remember", "croma")).toBe(false);
    expect(destinationAllowedForNeed("book", "ihcl")).toBe(true);
    expect(destinationAllowedForNeed("replace", "tata_1mg")).toBe(true);
    expect(catalogueEntry("westside").label).toBe("Westside");
  });
});
