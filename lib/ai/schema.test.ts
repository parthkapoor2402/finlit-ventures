import { describe, expect, it } from "vitest";
import { acceptIntentJson } from "@/lib/ai/schema";

describe("acceptIntentJson", () => {
  it("accepts a short structure and ignores no extra shop fields", () => {
    const draft = acceptIntentJson(
      JSON.stringify({
        title: "Going home",
        kind: "going",
        suggestions: [
          { title: "Travel home", type: "book" },
          { title: "Pack", type: "prepare" },
        ],
      }),
    );
    expect(draft?.kind).toBe("going");
    expect(draft?.suggestions).toHaveLength(2);
  });

  it("rejects a destination, a price, a percent, or too many lines", () => {
    expect(acceptIntentJson('{"title":"Croma charger","kind":"fix","suggestions":[{"title":"Replace charger","type":"replace"}]}')).toBeNull();
    expect(acceptIntentJson('{"title":"Charger","kind":"fix","suggestions":[{"title":"Replace charger","type":"replace","destination":"croma"}]}')).toBeNull();
    expect(acceptIntentJson('{"title":"Charger","kind":"fix","price":"₹100","suggestions":[{"title":"Replace charger","type":"replace"}]}')).toBeNull();
    expect(acceptIntentJson('{"title":"Save 10%","kind":"buy","suggestions":[{"title":"Buy something","type":"buy"}]}')).toBeNull();
    expect(
      acceptIntentJson(
        JSON.stringify({
          title: "Busy",
          kind: "other",
          suggestions: [
            { title: "One", type: "remember" },
            { title: "Two", type: "remember" },
            { title: "Three", type: "remember" },
            { title: "Four", type: "remember" },
            { title: "Five", type: "remember" },
          ],
        }),
      ),
    ).toBeNull();
    expect(acceptIntentJson('{"title":"Nope","kind":"fitness","suggestions":[{"title":"Workout","type":"plan"}]}')).toBeNull();
  });
});
