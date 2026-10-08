import type { NeedType, TataDestination } from "@/lib/types";

export interface TataRoute {
  destination: TataDestination;
  label: string;
  also: readonly string[];
  category: string;
  pattern: RegExp;
}

const ACADEMIC =
  /\b(assignment|assignments|homework|class|classes|lecture|exam|submit|deadline|reading)\b/i;

export const TATA_ROUTES: readonly TataRoute[] = [
  {
    destination: "tata_1mg",
    label: "Tata 1mg",
    also: [],
    category: "healthcare",
    pattern: /\b(medicine|medicines|pharmacy|vitamin|bandage|healthcare)\b/i,
  },
  {
    destination: "croma",
    label: "Croma",
    also: [],
    category: "electronics",
    pattern:
      /\b(charger|cable|earphone|earphones|headphone|headphones|adapter|laptop|phone|mouse|keyboard|usb|electronics|travel essentials)\b/i,
  },
  {
    destination: "tanishq",
    label: "Tanishq",
    also: ["Mia", "CaratLane"],
    category: "jewellery",
    pattern: /\b(jewellery|jewelry|necklace|ring|gold)\b/i,
  },
  {
    destination: "titan",
    label: "Titan",
    also: ["Fastrack", "Helios"],
    category: "watches",
    pattern: /\bwatch(?:es)?\b/i,
  },
  {
    destination: "bigbasket",
    label: "BigBasket",
    also: [],
    category: "groceries",
    pattern: /\b(grocery|groceries|milk|snack|snacks|vegetable|vegetables|ration|household)\b/i,
  },
  {
    destination: "qmin",
    label: "Qmin",
    also: [],
    category: "food",
    pattern: /\b(cake|dinner|meal|food)\b/i,
  },
  {
    destination: "ihcl",
    label: "Taj",
    also: ["IHCL", "Ginger"],
    category: "hospitality",
    pattern: /\b(hotel|stay|taj|ginger)\b/i,
  },
  {
    destination: "westside",
    label: "Westside",
    also: ["Tata CLiQ Fashion"],
    category: "fashion",
    pattern: /\b(gift|outfit|clothes|clothing|shirt|dress|birthday|fashion)\b/i,
  },
  {
    destination: "travel",
    label: "Air India",
    also: ["Air India Express"],
    category: "travel",
    pattern: /\b(flight|flights|train|ticket|travel|airport|home)\b/i,
  },
];

const BRAND_NAMES = TATA_ROUTES.flatMap((route) => [route.label, ...route.also]);

export function allowedBrandNames(): readonly string[] {
  return BRAND_NAMES;
}

export function isAllowedBrand(value: string): boolean {
  const name = value.trim().toLowerCase();
  return BRAND_NAMES.some((brand) => brand.toLowerCase() === name);
}

export function brandListForPrompt(): string {
  return TATA_ROUTES.map((route) => {
    const names = [route.label, ...route.also].join(", ");
    return `${route.category}: ${names}`;
  }).join("\n");
}

export function routeNeed(type: NeedType, title: string): TataDestination | null {
  const text = title.trim();
  if (!text || ACADEMIC.test(text)) return null;
  for (const route of TATA_ROUTES) {
    if (route.destination === "travel" && type === "remember") continue;
    if (route.pattern.test(text)) return route.destination;
  }
  return null;
}
