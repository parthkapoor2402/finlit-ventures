import type { WeeklyCounts } from "@/lib/types";
import { brandListForPrompt } from "@/lib/tata/ecosystem";

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
    "You are the intent orchestration engine for Tata NeuPlan.",
    "Convert the life situation into independent actionable needs.",
    "Never collapse multiple distinct needs into one.",
    "Return JSON only, with keys occasion and needs.",
    "needs is an array of 1 to 6 objects.",
    "Each need has title, action, and category.",
    "action is one of: buy, book, prepare, remember, replace, plan.",
    "category is one of: travel, electronics, fashion, jewellery, watches, groceries, healthcare, hospitality, food, other.",
    "You may add recommendedBrand only when it is in the allowed catalogue below.",
    "Never invent a Tata brand outside that catalogue.",
    "Do not invent a price, an earn rate, inventory, or an offer.",
    "Do not use a rupee sign or a percent sign.",
    "The parent occasion is not a merchant.",
    "Allowed catalogue:",
    brandListForPrompt(),
    "Sentence:",
    sentence,
  ].join("\n");
}
