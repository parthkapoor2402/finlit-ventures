import type { NeedType, WeekShape } from "@/lib/types";

export interface SeedItemDraft {
  type: WeekShape;
  title: string;
  dayIndex: number;
  time: string | null;
}

export interface SeedNeedDraft {
  type: NeedType;
  title: string;
  dayIndex: number;
}

const ACADEMIC = /\b(assignment|homework|class|lecture|exam|submit)\b/i;
const MEDICINE = /\b(medicine|pharmacy|vitamin)\b/i;
const ELECTRONICS = /\b(charger|cable|earphone|adapter|laptop|usb)\b/i;
const GROCERY = /\b(grocery|groceries|milk|snack)\b/i;
const FASHION = /\b(gift|outfit|clothes|birthday)\b/i;
const TRAVEL = /\b(flight|train|travel|ticket)\b|\bhome\b/i;

export function inferNeed(text: string): { type: NeedType; title: string } {
  const title = text.trim().slice(0, 80);
  if (ACADEMIC.test(title)) return { type: "remember", title };
  if (MEDICINE.test(title)) return { type: "buy", title };
  if (ELECTRONICS.test(title)) return { type: "replace", title };
  if (GROCERY.test(title)) return { type: "buy", title };
  if (FASHION.test(title)) return { type: "buy", title };
  if (TRAVEL.test(title)) return { type: "book", title };
  return { type: "remember", title };
}

export function seedDrafts(shapes: readonly WeekShape[], note: string | null): {
  items: SeedItemDraft[];
  needs: SeedNeedDraft[];
} {
  const items: SeedItemDraft[] = [];
  const needs: SeedNeedDraft[] = [];
  const picked = new Set(shapes);

  if (picked.has("classes")) items.push({ type: "classes", title: "Classes", dayIndex: 0, time: "10:00" });
  if (picked.has("study")) items.push({ type: "study", title: "Assignment due", dayIndex: 1, time: "18:00" });
  if (picked.has("fitness")) items.push({ type: "fitness", title: "Workout", dayIndex: 2, time: "07:00" });
  if (picked.has("personal")) items.push({ type: "personal", title: "Plan the weekend", dayIndex: 3, time: null });
  if (picked.has("shopping")) needs.push({ type: "replace", title: "Replace charger", dayIndex: 2 });
  if (picked.has("health")) needs.push({ type: "buy", title: "Pick up medicine", dayIndex: 3 });
  if (picked.has("food")) needs.push({ type: "buy", title: "Groceries for the week", dayIndex: 3 });
  if (picked.has("travel")) needs.push({ type: "book", title: "Travel home", dayIndex: 4 });
  if (picked.has("events")) needs.push({ type: "buy", title: "Birthday gift", dayIndex: 5 });

  const trimmed = note?.trim() ?? "";
  if (trimmed) {
    const inferred = inferNeed(trimmed);
    if (!needs.some((need) => need.title.toLowerCase() === inferred.title.toLowerCase())) {
      needs.push({ ...inferred, dayIndex: 6 });
    }
  } else if (picked.has("other")) {
    needs.push({ type: "remember", title: "Something to sort", dayIndex: 6 });
  }

  return { items, needs };
}
