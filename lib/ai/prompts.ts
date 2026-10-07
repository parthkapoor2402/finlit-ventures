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

export function buildIntentPrompt(sentence: string): string {
  return [
    "Turn the sentence below into JSON only.",
    "Use keys title, kind, and suggestions.",
    "kind is one of: going, buy, fix, exam, friends, weekend, birthday, other.",
    "suggestions is an array of up to 4 objects with keys title and type.",
    "type is one of: buy, book, prepare, remember, replace, plan.",
    "Do not name a shop, a brand, a destination, a product, a price, inventory, or an offer.",
    "Do not use a rupee sign or a percent sign.",
    "Do not add keys other than title, kind, and suggestions.",
    sentence,
  ].join("\n");
}
