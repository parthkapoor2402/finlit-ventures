import type { NeedType, TataDestination, TataResolution } from "@/lib/types";
import { TATA_DESTINATIONS } from "@/lib/types";

export interface CatalogueEntry {
  destination: TataDestination;
  label: string;
  note: string;
  isLive: false;
  demoOnly: true;
}

const ENTRIES: Record<TataDestination, Omit<CatalogueEntry, "destination">> = {
  croma: {
    label: "Croma",
    note: "Electronics. This demo does not show a price, a stock count, or a store.",
    isLive: false,
    demoOnly: true,
  },
  westside: {
    label: "Westside",
    note: "Fashion. This demo does not show a price or a size.",
    isLive: false,
    demoOnly: true,
  },
  bigbasket: {
    label: "BigBasket",
    note: "Grocery. This demo does not show a basket or a delivery slot.",
    isLive: false,
    demoOnly: true,
  },
  tata_1mg: {
    label: "Tata 1mg",
    note: "Pharmacy. This demo does not show a medicine, a substitute, or a price.",
    isLive: false,
    demoOnly: true,
  },
  travel: {
    label: "Air India",
    note: "Travel on Tata Neu. This demo does not show a fare or a seat.",
    isLive: false,
    demoOnly: true,
  },
  ihcl: {
    label: "IHCL",
    note: "Hotels. Taj, Ginger and the other IHCL brands. This demo does not show a room or a rate.",
    isLive: false,
    demoOnly: true,
  },
  neu_upi: {
    label: "Neu UPI",
    note: "Payments. This demo does not move money.",
    isLive: false,
    demoOnly: true,
  },
};

export const NEED_DESTINATIONS: Record<NeedType, readonly TataDestination[]> = {
  buy: ["croma", "westside", "bigbasket"],
  book: ["travel", "ihcl"],
  prepare: ["bigbasket", "tata_1mg"],
  remember: [],
  replace: ["croma", "tata_1mg", "westside"],
  plan: ["travel", "ihcl", "neu_upi"],
};

export function isTataDestination(value: string): value is TataDestination {
  return (TATA_DESTINATIONS as readonly string[]).includes(value);
}

export function catalogueEntry(destination: TataDestination): CatalogueEntry {
  const entry = ENTRIES[destination];
  return { destination, ...entry };
}

export function listCatalogue(): CatalogueEntry[] {
  return TATA_DESTINATIONS.map((destination) => catalogueEntry(destination));
}

export function resolutionFor(
  destination: TataDestination,
): TataResolution {
  const entry = catalogueEntry(destination);
  return {
    destination: entry.destination,
    label: entry.label,
    isLive: false,
    demoOnly: true,
  };
}

export function destinationAllowedForNeed(
  type: NeedType,
  destination: TataDestination,
): boolean {
  return NEED_DESTINATIONS[type].includes(destination);
}
