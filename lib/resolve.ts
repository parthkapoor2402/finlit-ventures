import type { NeedType, TataDestination } from "@/lib/types";

const ACADEMIC =
  /\b(assignment|assignments|homework|class|classes|lecture|exam|submit|deadline|reading)\b/i;
const MEDICINE = /\b(medicine|medicines|pharmacy|vitamin|bandage)\b/i;
const ELECTRONICS =
  /\b(charger|cable|earphone|earphones|headphone|headphones|adapter|laptop|phone|mouse|keyboard|usb)\b/i;
const GROCERY = /\b(grocery|groceries|milk|snack|snacks|vegetable|vegetables|ration)\b/i;
const HOTEL = /\b(hotel|stay|taj|ginger)\b/i;
const FASHION = /\b(gift|outfit|clothes|shirt|dress|birthday)\b/i;
const TRAVEL = /\b(flight|flights|train|ticket|travel|airport)\b/i;

export function suggestResolution(type: NeedType, title: string): TataDestination | null {
  const text = title.trim();
  if (!text) return null;
  if (ACADEMIC.test(text)) return null;
  if (MEDICINE.test(text)) return "tata_1mg";
  if (ELECTRONICS.test(text)) return "croma";
  if (GROCERY.test(text)) return "bigbasket";
  if (HOTEL.test(text)) return "ihcl";
  if (FASHION.test(text)) return "westside";
  if (type === "remember") return null;
  if (TRAVEL.test(text) || /\bhome\b/i.test(text)) return "travel";
  return null;
}

export function resolutionReason(destination: TataDestination): string {
  switch (destination) {
    case "croma":
      return "For electronics";
    case "westside":
      return "For something to wear or give";
    case "bigbasket":
      return "For groceries";
    case "tata_1mg":
      return "For a health item";
    case "travel":
      return "For a trip, including Air India";
    case "ihcl":
      return "For a stay";
    case "neu_upi":
      return "For a payment. This demo does not move money.";
  }
}
