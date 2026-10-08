import type { HelpFocus, LivingSituation, User, WeekShape } from "@/lib/types";

export const DRAFT_KEY = "neuplan.draft";
export const USER_KEY = "neuplan.user";

export interface OnboardingDraft {
  step: 1 | 2;
  weekShapes: WeekShape[];
  livingSituation: LivingSituation | null;
  helpWith: HelpFocus[];
  note: string;
}

export const EMPTY_DRAFT: OnboardingDraft = {
  step: 1,
  weekShapes: [],
  livingSituation: null,
  helpWith: [],
  note: "",
};

function storage(): Storage | null {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

export function readDraft(): OnboardingDraft {
  const raw = storage()?.getItem(DRAFT_KEY);
  if (!raw) return { ...EMPTY_DRAFT };
  try {
    const parsed = JSON.parse(raw) as Partial<OnboardingDraft>;
    const step = parsed.step === 2 ? 2 : 1;
    return {
      step,
      weekShapes: Array.isArray(parsed.weekShapes) ? parsed.weekShapes : [],
      livingSituation: parsed.livingSituation ?? null,
      helpWith: Array.isArray(parsed.helpWith) ? parsed.helpWith : [],
      note: typeof parsed.note === "string" ? parsed.note.slice(0, 140) : "",
    };
  } catch {
    return { ...EMPTY_DRAFT };
  }
}

export function writeDraft(draft: OnboardingDraft): void {
  storage()?.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function clearDraft(): void {
  storage()?.removeItem(DRAFT_KEY);
}

export function readCachedUser(): User | null {
  const raw = storage()?.getItem(USER_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as User;
    if (parsed?.id !== "demo-ananya") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeCachedUser(user: User): void {
  storage()?.setItem(USER_KEY, JSON.stringify(user));
}
