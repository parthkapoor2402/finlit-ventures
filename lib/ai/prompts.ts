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
    "needs must be an array. One array entry per independent requirement.",
    "A sentence that asks for a flight, a charger, and clothes is three needs, not one.",
    "Each need has its own title, action, and category.",
    "Do not copy one action or one brand onto the whole sentence.",
    "action is one of: buy, book, prepare, remember, replace, plan.",
    "Use replace only when that need's own words say replace, broken, stopped, repair, or fix.",
    "A charger that the user wants to buy is action buy. A charger the user wants to replace is action replace.",
    "category is one of: travel, electronics, fashion, jewellery, watches, groceries, healthcare, hospitality, food, other.",
    "You may add recommendedBrand only when it is in the allowed catalogue below.",
    "Choose the brand for each need after you split the sentence.",
    "Flight uses Air India. A charger uses Croma. Clothes or a dress uses Westside. A hotel uses Taj. A watch uses Titan.",
    "Never invent a Tata brand outside that catalogue.",
    "Do not invent a price, an earn rate, inventory, or an offer.",
    "Do not use a rupee sign or a percent sign.",
    "Do not use the original sentence as a need title.",
    "The parent occasion is not a merchant and is not a need.",
    'Example: {"occasion":"Trip to Mumbai","needs":[{"title":"Flight","action":"book","category":"travel","recommendedBrand":"Air India"},{"title":"Charger","action":"buy","category":"electronics","recommendedBrand":"Croma"},{"title":"Clothes","action":"buy","category":"fashion","recommendedBrand":"Westside"}]}',
    "A single request stays a one-element array. Buy a charger today is one need titled Charger with action buy.",
    "Allowed catalogue:",
    brandListForPrompt(),
    "Sentence:",
    sentence,
  ].join("\n");
}
