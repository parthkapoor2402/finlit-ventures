import { allowedBrandNames, brandListForPrompt, isAllowedBrand } from "@/lib/tata/ecosystem";
import { MOMENT_KINDS, NEED_TYPES, type MomentKind, type NeedType } from "@/lib/types";

export interface IntentDraft {
  title: string;
  kind: MomentKind;
  suggestions: { title: string; type: NeedType }[];
}

const PRICE = /₹|%|\b(?:price|prices|offer|offers|discount|stock|inventory)\b/i;

const ACTIONS: Record<string, NeedType> = {
  buy: "buy",
  book: "book",
  prepare: "prepare",
  remember: "remember",
  replace: "replace",
  fix: "replace",
  plan: "plan",
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function isKind(value: string): value is MomentKind {
  return (MOMENT_KINDS as readonly string[]).includes(value);
}

function isNeedType(value: string): value is NeedType {
  return (NEED_TYPES as readonly string[]).includes(value);
}

function unwrap(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return (fenced?.[1] ?? trimmed).trim();
}

function mentionsBrand(value: string): boolean {
  const lower = value.toLowerCase();
  return allowedBrandNames().some((brand) => lower.includes(brand.toLowerCase()));
}

function cleanTitle(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const title = value.trim();
  if (!title || title.length > 80 || PRICE.test(title) || mentionsBrand(title)) return null;
  return title;
}

function kindFromTitle(title: string): MomentKind {
  if (/\bbirthday\b/i.test(title)) return "birthday";
  if (/\b(trip|flight|travel|vacation|hotel)\b/i.test(title)) return "going";
  if (/\bexam/i.test(title)) return "exam";
  return "other";
}

function readSuggestion(entry: unknown): { title: string; type: NeedType } | null {
  const suggestion = asRecord(entry);
  if (!suggestion) return null;
  const title = cleanTitle(suggestion.title);
  if (!title) return null;
  const action = typeof suggestion.action === "string" ? suggestion.action : suggestion.type;
  if (typeof action !== "string") return null;
  const type = ACTIONS[action] ?? (isNeedType(action) ? action : null);
  if (!type) return null;
  if (typeof suggestion.recommendedBrand === "string" && suggestion.recommendedBrand.trim()) {
    if (!isAllowedBrand(suggestion.recommendedBrand)) return null;
  }
  return { title, type };
}

export function acceptIntentJson(raw: string): IntentDraft | null {
  if (!raw.trim() || PRICE.test(raw)) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(unwrap(raw)) as unknown;
  } catch {
    return null;
  }
  const record = asRecord(parsed);
  if (!record) return null;

  if (Array.isArray(record.needs)) {
    const title = cleanTitle(record.occasion ?? record.title);
    if (!title) return null;
    if (record.needs.length === 0 || record.needs.length > 6) return null;
    const suggestions = [];
    for (const entry of record.needs) {
      const suggestion = readSuggestion(entry);
      if (!suggestion) return null;
      suggestions.push(suggestion);
    }
    const kind = typeof record.kind === "string" && isKind(record.kind) ? record.kind : kindFromTitle(title);
    return { title, kind, suggestions };
  }

  if (typeof record.title !== "string") return null;
  const title = cleanTitle(record.title);
  if (!title) return null;
  if (typeof record.kind !== "string" || !isKind(record.kind)) return null;
  if (!Array.isArray(record.suggestions) || record.suggestions.length === 0 || record.suggestions.length > 6) {
    return null;
  }
  const suggestions = [];
  for (const entry of record.suggestions) {
    const suggestion = asRecord(entry);
    if (!suggestion) return null;
    if ("destination" in suggestion || "recommendedBrand" in suggestion) return null;
    const line = readSuggestion(suggestion);
    if (!line) return null;
    suggestions.push(line);
  }
  return { title, kind: record.kind, suggestions };
}

export function cataloguePromptLines(): string {
  return brandListForPrompt();
}
