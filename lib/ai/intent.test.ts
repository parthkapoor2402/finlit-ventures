import { beforeEach, describe, expect, it, vi } from "vitest";

const generateModelText = vi.hoisted(() => vi.fn());

vi.mock("@/lib/ai/gemini", () => {
  class GeminiError extends Error {
    readonly reason: string;

    constructor(reason: string) {
      super(reason);
      this.name = "GeminiError";
      this.reason = reason;
    }
  }
  return { GeminiError, generateModelText, generateSummary: generateModelText };
});

import { interpretIntent } from "@/lib/ai/intent";
import { buildIntentPrompt } from "@/lib/ai/prompts";

const NOW = new Date("2026-10-07T12:00:00+05:30");

describe("interpretIntent", () => {
  beforeEach(() => {
    generateModelText.mockReset();
  });

  it("keeps the sentence in the prompt and names no destination", () => {
    const prompt = buildIntentPrompt("My charger stopped working");
    expect(prompt).toContain("My charger stopped working");
    expect(prompt.toLowerCase()).not.toContain("croma");
    expect(prompt.toLowerCase()).not.toContain("westside");
  });

  it("uses the local parser when the model is unavailable", async () => {
    generateModelText.mockRejectedValue(Object.assign(new Error("missing_key"), { reason: "missing_key", name: "GeminiError" }));
    const result = await interpretIntent("My charger stopped working", NOW);
    expect(result.source).toBe("fallback");
    expect(result.intent.suggestions[0]).toMatchObject({ title: "Replace charger", selectedByDefault: true });
  });

  it("drops a reply that names a shop and still returns lines", async () => {
    generateModelText.mockResolvedValue('{"title":"Croma","kind":"fix","suggestions":[{"title":"USB-C charger","type":"replace"}]}');
    const result = await interpretIntent("My charger stopped working", NOW);
    expect(result.source).toBe("fallback");
    expect(result.reason).toBe("malformed");
    expect(JSON.stringify(result.intent)).not.toMatch(/croma/i);
    expect(result.intent.suggestions[0]?.title).toBe("Replace charger");
  });

  it("accepts a valid structure and still dates the line locally", async () => {
    generateModelText.mockResolvedValue(
      JSON.stringify({
        title: "Exams",
        kind: "exam",
        suggestions: [{ title: "Study", type: "buy" }],
      }),
    );
    const result = await interpretIntent("My exams start Monday", NOW);
    expect(result.source).toBe("gemini");
    expect(result.intent.day).toBeNull();
    expect(result.intent.suggestions).toEqual([{ title: "Study", type: "remember", selectedByDefault: false }]);
  });
});
