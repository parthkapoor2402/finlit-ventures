import { GeminiError, generateModelText } from "@/lib/ai/gemini";
import { buildIntentPrompt } from "@/lib/ai/prompts";
import { acceptIntentJson } from "@/lib/ai/schema";
import { dayFromSentence, parseIntent, selectionFor, type ParsedIntent } from "@/lib/intent/parse";

export interface IntentResult {
  intent: ParsedIntent;
  source: "gemini" | "fallback";
  reason: string | null;
}

export async function interpretIntent(text: string, now = new Date()): Promise<IntentResult> {
  const fallback = parseIntent(text, now);
  try {
    const raw = await generateModelText(buildIntentPrompt(text), 400);
    const draft = acceptIntentJson(raw);
    if (!draft) {
      return { intent: fallback, source: "fallback", reason: "malformed" };
    }
    return {
      intent: {
        title: draft.title,
        kind: draft.kind,
        day: dayFromSentence(text, now),
        suggestions: selectionFor(draft.kind, draft.suggestions),
      },
      source: "gemini",
      reason: null,
    };
  } catch (error) {
    const reason = error instanceof GeminiError ? error.reason : "request_failed";
    return { intent: fallback, source: "fallback", reason };
  }
}
