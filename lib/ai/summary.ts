import { createHash, randomUUID } from "node:crypto";
import { buildCounts } from "@/lib/ai/counts";
import { acceptSummary } from "@/lib/ai/accept";
import { fallbackSummary } from "@/lib/ai/fallback";
import { GeminiError, generateSummary } from "@/lib/ai/gemini";
import { buildPrompt } from "@/lib/ai/prompts";
import { getInsight, getUser, getWeek, listNeeds, saveInsight } from "@/lib/repository";
import type { AIInsight, WeeklyCounts } from "@/lib/types";

export function countsCacheKey(counts: WeeklyCounts): string {
  return createHash("sha256").update(JSON.stringify(counts)).digest("hex");
}

export async function composeSummary(args: {
  counts: WeeklyCounts;
  cached: AIInsight | null;
  now: Date;
  generate: (prompt: string) => Promise<string>;
}): Promise<{ insight: AIInsight; cached: boolean }> {
  const cacheKey = countsCacheKey(args.counts);
  if (args.cached && args.cached.cacheKey === cacheKey) {
    return { insight: args.cached, cached: true };
  }

  let text = "";
  let source: AIInsight["source"] = "gemini";
  let fallbackReason: string | null = null;
  try {
    text = (await args.generate(buildPrompt(args.counts))).trim();
    if (!acceptSummary(text, args.counts)) {
      text = fallbackSummary(args.counts);
      source = "fallback";
      fallbackReason = "malformed";
    }
  } catch (error) {
    text = fallbackSummary(args.counts);
    source = "fallback";
    fallbackReason = error instanceof GeminiError ? error.reason : "request_failed";
  }

  const insight: AIInsight = {
    id: randomUUID(),
    source,
    text,
    counts: args.counts,
    cacheKey,
    generatedAt: args.now.toISOString(),
    fallbackReason,
  };
  return { insight, cached: false };
}

export async function createWeeklySummary(now = new Date()) {
  const user = await getUser();
  const week = await getWeek(now);
  const needs = await listNeeds();
  const cached = await getInsight();
  const result = await composeSummary({
    counts: buildCounts(user, week, needs),
    cached,
    now,
    generate: generateSummary,
  });
  if (!result.cached) await saveInsight(result.insight);
  return result;
}
