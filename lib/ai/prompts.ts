import type { WeeklyCounts } from "@/lib/types";

export function buildPrompt(counts: WeeklyCounts): string {
  return [
    "Write a note about this student's current week.",
    "Use only the numbers and labels in the JSON.",
    "Write at most three short sentences.",
    "Do not invent events, products, prices, inventory, discounts, history, colleges, roommates, or financial advice.",
    "Do not recommend a purchase.",
    "If the item counts and the open-need count are zero, say the week is clear.",
    JSON.stringify(counts),
  ].join("\n");
}
