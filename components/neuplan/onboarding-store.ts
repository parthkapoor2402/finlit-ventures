import { readDraft, writeDraft, type OnboardingDraft } from "@/lib/local-user";

const listeners = new Set<() => void>();
let snapshot: OnboardingDraft | null = null;

function compute(): OnboardingDraft {
  const stored = readDraft();
  const params = new URLSearchParams(window.location.search);
  const requested = Number(params.get("step"));
  const step = requested === 2 ? 2 : 1;
  const next: OnboardingDraft = { ...stored, step };
  if (next.step > 1 && next.weekShapes.length === 0) next.step = 1;
  return next;
}

export function resetOnboardingSnapshot(): void {
  snapshot = null;
}

export function subscribeOnboarding(listener: () => void): () => void {
  listeners.add(listener);
  const onPop = () => {
    snapshot = compute();
    listener();
  };
  window.addEventListener("popstate", onPop);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("popstate", onPop);
  };
}

export function getOnboardingSnapshot(): OnboardingDraft {
  snapshot ??= compute();
  return snapshot;
}

export function getOnboardingServerSnapshot(): null {
  return null;
}

export function publishOnboarding(next: OnboardingDraft): void {
  snapshot = next;
  writeDraft(next);
  for (const listener of listeners) listener();
}
