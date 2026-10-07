import type { WeeklyCounts } from "@/lib/types";

const FORBIDDEN = [
  /₹/,
  /\brs\.?/i,
  /%/,
  /discount/i,
  /offer/i,
  /\bprice/i,
  /\bstock\b/i,
  /hurry/i,
  /limited/i,
  /\bcoin/i,
  /streak/i,
  /roommate/i,
  /college/i,
  /buy now/i,
];

export function acceptSummary(text: string, counts: WeeklyCounts): boolean {
  const trimmed = text.trim();
  if (!trimmed || trimmed.length > 600) return false;
  if (FORBIDDEN.some((pattern) => pattern.test(trimmed))) return false;
  const json = JSON.stringify(counts);
  const numbers = trimmed.match(/\d+/g) ?? [];
  return numbers.every((value) => json.includes(value));
}
