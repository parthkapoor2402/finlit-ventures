import type { WeeklyCounts } from "@/lib/types";

export function fallbackSummary(counts: WeeklyCounts): string {
  const total = counts.itemsByState.planned + counts.itemsByState.done;
  const open = counts.needsByState.open;
  if (total === 0 && open === 0) {
    return "Your week is clear, and no needs are open. This note was written by the app from those counts.";
  }
  const itemWord = total === 1 ? "item" : "items";
  const needWord = open === 1 ? "need is" : "needs are";
  return `This week has ${total} ${itemWord}: ${counts.itemsByState.planned} planned and ${counts.itemsByState.done} done. ${open} ${needWord} still open. This note was written by the app from those counts.`;
}
