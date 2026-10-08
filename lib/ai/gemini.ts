import { GoogleGenAI } from "@google/genai";

export type GeminiReason = "missing_key" | "missing_model" | "timeout" | "request_failed" | "malformed";

export class GeminiError extends Error {
  readonly reason: GeminiReason;

  constructor(reason: GeminiReason) {
    super(reason);
    this.name = "GeminiError";
    this.reason = reason;
  }
}

function isTimeout(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const name = "name" in error ? String(error.name) : "";
  return name === "TimeoutError" || name === "AbortError";
}

export async function generateModelText(prompt: string, maxOutputTokens = 200): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY?.trim() ?? "";
  const model = process.env.GEMINI_MODEL?.trim() ?? "";
  if (!apiKey) throw new GeminiError("missing_key");
  if (!model) throw new GeminiError("missing_model");

  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        temperature: 0,
        maxOutputTokens,
        thinkingConfig: { thinkingBudget: 0 },
        abortSignal: AbortSignal.timeout(8000),
      },
    });
    const text = response.text?.trim() ?? "";
    if (!text) throw new GeminiError("malformed");
    return text;
  } catch (error) {
    if (error instanceof GeminiError) throw error;
    if (isTimeout(error)) throw new GeminiError("timeout");
    throw new GeminiError("request_failed");
  }
}

export async function generateSummary(prompt: string): Promise<string> {
  return generateModelText(prompt);
}
