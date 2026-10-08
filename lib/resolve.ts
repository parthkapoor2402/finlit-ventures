import type { NeedType, TataDestination } from "@/lib/types";
import { routeNeed } from "@/lib/tata/ecosystem";

export function suggestResolution(type: NeedType, title: string): TataDestination | null {
  return routeNeed(type, title);
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
      return "For a stay. Taj, IHCL or Ginger.";
    case "neu_upi":
      return "For a payment. This demo does not move money.";
    case "tanishq":
      return "For jewellery. Tanishq, Mia or CaratLane.";
    case "titan":
      return "For a watch. Titan, Fastrack or Helios.";
    case "qmin":
      return "For food.";
  }
}
