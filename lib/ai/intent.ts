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
  const named = fallback.suggestions.filter((line) => line.selectedByDefault);
  try {
    const raw = await generateModelText(buildIntentPrompt(text), 1200, true);
    const draft = acceptIntentJson(raw);
    if (named.length >= 2 && (!draft || draft.suggestions.length < named.length)) {
      return { intent: fallback, source: "fallback", reason: draft ? "collapsed" : "malformed" };
    }
    if (!draft) {
      return { intent: fallback, source: "fallback", reason: "malformed" };
    }
    if (named.length >= 2) {
      return {
        intent: {
          title: draft.title,
          kind: fallback.kind,
          day: fallback.day,
          suggestions: draft.suggestions.map((line) => ({ ...line, selectedByDefault: true })),
        },
        source: "gemini",
        reason: null,
      };
    }
    const local = fallback.suggestions[0];
    const modelLine = draft.suggestions[0];
    const echoed =
      local !== undefined &&
      modelLine !== undefined &&
      local.selectedByDefault &&
      local.title.length <= 24 &&
      modelLine.title.trim().toLowerCase() !== local.title.trim().toLowerCase() &&
      (modelLine.title.trim().toLowerCase() === text.trim().toLowerCase() ||
        modelLine.title.length > local.title.length + 12);
    if (echoed) {
      return { intent: fallback, source: "fallback", reason: "collapsed" };
    }
    return {
      intent: {
        title: draft.title,
        kind: draft.kind,
        day: dayFromSentence(text, now),
        suggestions: selectionFor(draft.kind, draft.suggestions),
        clarify: fallback.clarify,
      },
      source: "gemini",
      reason: null,
    };
  } catch (error) {
    const reason = error instanceof GeminiError ? error.reason : "request_failed";
    return { intent: fallback, source: "fallback", reason };
  }
}
