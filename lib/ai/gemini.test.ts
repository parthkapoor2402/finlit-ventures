import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const generateContent = vi.hoisted(() => vi.fn());

vi.mock("@google/genai", () => ({
  GoogleGenAI: class {
    models = { generateContent };
  },
}));

import { GeminiError, generateModelText, generateSummary } from "@/lib/ai/gemini";

describe("generateSummary", () => {
  const previousKey = process.env.GEMINI_API_KEY;
  const previousModel = process.env.GEMINI_MODEL;

  beforeEach(() => {
    generateContent.mockReset();
    delete process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_MODEL;
  });

  afterEach(() => {
    if (previousKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = previousKey;
    if (previousModel === undefined) delete process.env.GEMINI_MODEL;
    else process.env.GEMINI_MODEL = previousModel;
  });

  it("does not call the SDK when the key is missing", async () => {
    process.env.GEMINI_MODEL = "configured-by-env";
    await expect(generateSummary("counts")).rejects.toMatchObject({ reason: "missing_key" });
    expect(generateContent).not.toHaveBeenCalled();
  });

  it("does not call the SDK when the model is missing", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    await expect(generateSummary("counts")).rejects.toBeInstanceOf(GeminiError);
    await expect(generateSummary("counts")).rejects.toMatchObject({ reason: "missing_model" });
    expect(generateContent).not.toHaveBeenCalled();
  });

  it("returns model text when the SDK succeeds", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    process.env.GEMINI_MODEL = "configured-by-env";
    generateContent.mockResolvedValue({ text: "This week has 1 planned item." });
    await expect(generateSummary("prompt")).resolves.toBe("This week has 1 planned item.");
    expect(generateContent).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "configured-by-env",
        contents: "prompt",
      }),
    );
    expect(generateContent.mock.calls[0]?.[0].config.responseMimeType).toBeUndefined();
  });

  it("asks the model for JSON when the caller needs a structure", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    process.env.GEMINI_MODEL = "configured-by-env";
    generateContent.mockResolvedValue({ text: "{}" });
    await generateModelText("prompt", 800, true);
    expect(generateContent.mock.calls[0]?.[0].config.responseMimeType).toBe("application/json");
  });

  it("maps a timeout and a thrown request to fallback reasons", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    process.env.GEMINI_MODEL = "configured-by-env";
    const timeout = new Error("timed out");
    timeout.name = "TimeoutError";
    generateContent.mockRejectedValueOnce(timeout);
    await expect(generateSummary("prompt")).rejects.toMatchObject({ reason: "timeout" });
    generateContent.mockRejectedValueOnce(new Error("nope"));
    await expect(generateSummary("prompt")).rejects.toMatchObject({ reason: "request_failed" });
  });

  it("treats an empty SDK reply as malformed", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    process.env.GEMINI_MODEL = "configured-by-env";
    generateContent.mockResolvedValue({ text: "   " });
    await expect(generateSummary("prompt")).rejects.toMatchObject({ reason: "malformed" });
  });

  it("does not log the key", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const info = vi.spyOn(console, "info").mockImplementation(() => undefined);
    process.env.GEMINI_API_KEY = "super-secret-key";
    process.env.GEMINI_MODEL = "configured-by-env";
    generateContent.mockRejectedValue(new Error("nope"));
    await expect(generateSummary("prompt")).rejects.toMatchObject({ reason: "request_failed" });
    const logged = [...spy.mock.calls, ...info.mock.calls].flat().join(" ");
    expect(logged).not.toContain("super-secret-key");
    spy.mockRestore();
    info.mockRestore();
  });
});
