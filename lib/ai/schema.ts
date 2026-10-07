import { NEED_TYPES, MOMENT_KINDS, type MomentKind, type NeedType } from "@/lib/types";

export interface IntentDraft {
  title: string;
  kind: MomentKind;
  suggestions: { title: string; type: NeedType }[];
}

const BANNED =
  /₹|%|\b(?:rs\.?|price|prices|offer|offers|discount|stock|inventory|croma|westside|big\s?basket|1mg|air\s?india|ihcl|cult|qmin|neu\s?upi|taj|ginger)\b/i;

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

export function acceptIntentJson(raw: string): IntentDraft | null {
  if (!raw.trim() || BANNED.test(raw)) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(unwrap(raw)) as unknown;
  } catch {
    return null;
  }
  const record = asRecord(parsed);
  if (!record) return null;
  const keys = Object.keys(record);
  if (keys.some((key) => key !== "title" && key !== "kind" && key !== "suggestions")) return null;
  if (typeof record.title !== "string") return null;
  const title = record.title.trim();
  if (!title || title.length > 80 || BANNED.test(title)) return null;
  if (typeof record.kind !== "string" || !isKind(record.kind)) return null;
  if (!Array.isArray(record.suggestions) || record.suggestions.length === 0 || record.suggestions.length > 4) {
    return null;
  }
  const suggestions: IntentDraft["suggestions"] = [];
  for (const entry of record.suggestions) {
    const suggestion = asRecord(entry);
    if (!suggestion) return null;
    const suggestionKeys = Object.keys(suggestion);
    if (suggestionKeys.some((key) => key !== "title" && key !== "type")) return null;
    if (typeof suggestion.title !== "string" || typeof suggestion.type !== "string") return null;
    const suggestionTitle = suggestion.title.trim();
    if (!suggestionTitle || suggestionTitle.length > 80 || BANNED.test(suggestionTitle)) return null;
    if (!isNeedType(suggestion.type)) return null;
    suggestions.push({ title: suggestionTitle, type: suggestion.type });
  }
  return { title, kind: record.kind, suggestions };
}
