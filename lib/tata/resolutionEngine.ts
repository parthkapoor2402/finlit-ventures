import { resolutionFor } from "@/lib/catalogue";
import { suggestResolution } from "@/lib/resolve";
import type { NeedType, TataDestination, TataResolution } from "@/lib/types";

const PACK = /\bpack(?:ing)?\b/i;
const STUDY = /\b(study|studying|revision|exam|exams|reminder)\b/i;

export function resolveNeed(type: NeedType, title: string): TataResolution | null {
  if (type === "remember") return null;
  if (PACK.test(title) || STUDY.test(title)) return null;
  const destination = suggestResolution(type, title);
  if (!destination) return null;
  return resolutionFor(destination);
}

export function destinationFor(type: NeedType, title: string): TataDestination | null {
  return resolveNeed(type, title)?.destination ?? null;
}
