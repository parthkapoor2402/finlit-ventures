"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { clearDraft, writeCachedUser, type OnboardingDraft } from "@/lib/local-user";
import { HELP_LABELS, LIVING_LABELS, WEEK_SHAPE_LABELS } from "@/lib/labels";
import { track } from "@/lib/track";
import { HELP_FOCUSES, LIVING_SITUATIONS, WEEK_SHAPES, type User } from "@/lib/types";
import {
  getOnboardingServerSnapshot,
  getOnboardingSnapshot,
  publishOnboarding,
  subscribeOnboarding,
} from "./onboarding-store";
import styles from "./Onboarding.module.css";

function toggle<T extends string>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function commit(next: OnboardingDraft, push: boolean) {
  const url = next.step === 1 ? "/neuplan/onboarding" : `/neuplan/onboarding?step=${next.step}`;
  if (push) window.history.pushState({ step: next.step }, "", url);
  else window.history.replaceState({ step: next.step }, "", url);
  publishOnboarding(next);
}

export function OnboardingFlow() {
  const router = useRouter();
  const [error, setError] = useState("");
  const draft = useSyncExternalStore(
    subscribeOnboarding,
    getOnboardingSnapshot,
    getOnboardingServerSnapshot,
  );

  if (!draft) {
    return (
      <main className={styles.page}>
        <h1 className={styles.title}>NeuPlan</h1>
        <p className={styles.hint}>Opening your answers.</p>
      </main>
    );
  }

  const current = draft;

  async function finish() {
    try {
    const response = await fetch("/api/user", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        livingSituation: current.livingSituation,
        weekShapes: current.weekShapes,
        helpWith: current.helpWith,
        onboardingComplete: true,
      }),
    });
    const body = (await response.json()) as { user?: User; message?: string };
    if (!response.ok || !body.user) {
      setError(body.message ?? "We could not save that.");
      return;
    }
    writeCachedUser(body.user);
    clearDraft();
    await track("neuplan_onboarding_complete", { source: "onboarding" });
    router.push("/neuplan");
    } catch {
      setError("We could not save that.");
    }
  }

  return (
    <main className={styles.page}>
      <p className={styles.kicker}>DEMO DATA · Ananya</p>
      <p className={styles.step}>{draft.step} of 3</p>
      {draft.step === 1 ? (
        <StepWeek draft={draft} />
      ) : null}
      {draft.step === 2 ? <StepLiving draft={draft} /> : null}
      {draft.step === 3 ? (
        <StepHelp draft={draft} error={error} onFinish={() => void finish()} />
      ) : null}
    </main>
  );
}

function StepWeek({ draft }: { draft: OnboardingDraft }) {
  return (
    <>
      <h1 className={styles.title}>What does this week include?</h1>
      <p className={styles.hint}>Choose at least one. This is not a timetable.</p>
      <ul className={styles.choices}>
        {WEEK_SHAPES.map((shape) => (
          <li key={shape}>
            <button
              type="button"
              aria-pressed={draft.weekShapes.includes(shape)}
              onClick={() => commit({ ...draft, weekShapes: toggle(draft.weekShapes, shape) }, false)}
            >
              {WEEK_SHAPE_LABELS[shape]}
            </button>
          </li>
        ))}
      </ul>
      <div className={styles.actions}>
        <Link href="/">Home</Link>
        <Button onClick={() => commit({ ...draft, step: 2 }, true)} disabled={draft.weekShapes.length === 0}>
          Continue
        </Button>
      </div>
    </>
  );
}

function StepLiving({ draft }: { draft: OnboardingDraft }) {
  return (
    <>
      <h1 className={styles.title}>Where are you living?</h1>
      <p className={styles.hint}>One answer. It is not a location.</p>
      <ul className={styles.choices}>
        {LIVING_SITUATIONS.map((situation) => (
          <li key={situation}>
            <button
              type="button"
              aria-pressed={draft.livingSituation === situation}
              onClick={() => commit({ ...draft, livingSituation: situation }, false)}
            >
              {LIVING_LABELS[situation]}
            </button>
          </li>
        ))}
      </ul>
      <div className={styles.actions}>
        <Button variant="secondary" onClick={() => commit({ ...draft, step: 1 }, true)}>
          Back
        </Button>
        <Button onClick={() => commit({ ...draft, step: 3 }, true)} disabled={!draft.livingSituation}>
          Continue
        </Button>
      </div>
    </>
  );
}

function StepHelp({
  draft,
  error,
  onFinish,
}: {
  draft: OnboardingDraft;
  error: string;
  onFinish: () => void;
}) {
  return (
    <>
      <h1 className={styles.title}>What should NeuPlan help with?</h1>
      <p className={styles.hint}>Choose at least one.</p>
      <ul className={styles.choices}>
        {HELP_FOCUSES.map((focus) => (
          <li key={focus}>
            <button
              type="button"
              aria-pressed={draft.helpWith.includes(focus)}
              onClick={() => commit({ ...draft, helpWith: toggle(draft.helpWith, focus) }, false)}
            >
              {HELP_LABELS[focus]}
            </button>
          </li>
        ))}
      </ul>
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
      <div className={styles.actions}>
        <Button variant="secondary" onClick={() => commit({ ...draft, step: 2 }, true)}>
          Back
        </Button>
        <Button onClick={onFinish} disabled={draft.helpWith.length === 0}>
          Finish
        </Button>
      </div>
    </>
  );
}
