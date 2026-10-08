import type { TataDestination } from "@/lib/types";

export interface DemoProduct {
  name: string;
  detail: string;
}

export const DEMO_PRODUCTS: Record<TataDestination, readonly DemoProduct[]> = {
  croma: [{ name: "USB-C charger", detail: "For a phone or a laptop." }],
  westside: [{ name: "Something to give", detail: "A demo fashion stop. No size." }],
  bigbasket: [{ name: "Weekly groceries", detail: "A demo grocery stop. No slot." }],
  tata_1mg: [{ name: "A health item", detail: "This demo does not name a medicine." }],
  travel: [{ name: "Trip home", detail: "Air India on Tata Neu. No fare and no seat." }],
  ihcl: [{ name: "A night away", detail: "Taj, IHCL or Ginger. No room and no rate." }],
  neu_upi: [{ name: "A payment", detail: "This demo does not move money." }],
  tanishq: [{ name: "A gold necklace", detail: "Tanishq, Mia or CaratLane. No price." }],
  titan: [{ name: "A watch", detail: "Titan, Fastrack or Helios. No price." }],
  qmin: [{ name: "A meal", detail: "A demo food stop. No menu." }],
};
