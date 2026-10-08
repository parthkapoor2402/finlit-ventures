"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LIVING_LABELS, WEEK_SHAPE_LABELS } from "@/lib/labels";
import { clearDraft, writeCachedUser, type OnboardingDraft } from "@/lib/local-user";
import { track } from "@/lib/track";
import { LIVING_SITUATIONS, SETUP_CHIPS, type User } from "@/lib/types";
import {
  getOnboardingServerSnapshot,
  getOnboardingSnapshot,
  publishOnboarding,
  subscribeOnboarding,
} from "./onboarding-store";
import styles from "./Plan.module.css";

function toggle<T extends string>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function commit(next: OnboardingDraft, push: boolean) {
  const url = next.step === 1 ? "/neuplan/onboarding" : "/neuplan/onboarding?step=2";
  if (push) window.history.pushState({ step: next.step }, "", url);
  else window.history.replaceState({ step: next.step }, "", url);
  publishOnboarding(next);
}

export function OnboardingFlow() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const draft = useSyncExternalStore(subscribeOnboarding, getOnboardingSnapshot, getOnboardingServerSnapshot);

  if (!draft) {
    return (
      <main className={styles.page}>
        <h1 className={styles.title}>NeuPlan</h1>
        <p className={styles.lead}>Opening your answers.</p>
      </main>
    );
  }

  const current = draft;

  async function finish() {
    if (!current.livingSituation || pending) return;
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          livingSituation: current.livingSituation,
          weekShapes: current.weekShapes,
          helpWith: ["see_the_week"],
          note: current.note,
          onboardingComplete: true,
        }),
      });
      const body = (await response.json()) as { user?: User; message?: string };
      if (!response.ok || !body.user) {
        setError(body.message ?? "We could not save that.");
        setPending(false);
        return;
      }
      writeCachedUser(body.user);
      clearDraft();
      await track("neuplan_onboarding_complete", { source: "onboarding" });
      router.push("/neuplan");
    } catch {
      setError("We could not save that.");
      setPending(false);
    }
  }

  return (
    <main className={styles.page}>
      <p className={styles.demo}>DEMO DATA · Ananya</p>
      <p className={styles.step}>{draft.step} of 2</p>
      {draft.step === 1 ? (
        <>
          <h1 className={styles.title}>What matters this week?</h1>
          <p className={styles.lead}>Pick what you want NeuPlan to keep in view. This is not a timetable.</p>
          <ul className={styles.chips}>
            {SETUP_CHIPS.map((shape) => (
              <li key={shape}>
                <button
                  type="button"
                  aria-pressed={draft.weekShapes.includes(shape)}
                  onClick={() => {
                    void track("neuplan_setup_started", { source: "onboarding" });
                    commit({ ...draft, weekShapes: toggle(draft.weekShapes, shape) }, false);
                  }}
                >
                  {WEEK_SHAPE_LABELS[shape]}
                </button>
              </li>
            ))}
          </ul>
          <label className={styles.note}>
            Anything already on your mind?
            <textarea
              value={draft.note}
              maxLength={140}
              placeholder="Optional. For example, replace my charger."
              onChange={(event) => commit({ ...draft, note: event.target.value }, false)}
            />
          </label>
          <div className={styles.actions}>
            <Link href="/neuplan/intro">Back</Link>
            <button
              type="button"
              className={styles.primaryLink}
              disabled={draft.weekShapes.length === 0}
              onClick={() => commit({ ...draft, step: 2 }, true)}
            >
              Continue
            </button>
          </div>
        </>
      ) : (
        <>
          <h1 className={styles.title}>Where do you usually stay?</h1>
          <p className={styles.lead}>This only changes the label on your week. It does not guess a city or a college.</p>
          <ul className={styles.chips}>
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
          {error ? (
            <p className={styles.error} role="alert">
              {error}
            </p>
          ) : null}
          <div className={styles.actions}>
            <Link href="/neuplan/onboarding">Back</Link>
            <button
              type="button"
              className={styles.primaryLink}
              disabled={!draft.livingSituation || pending}
              onClick={() => void finish()}
            >
              Set up my week
            </button>
          </div>
        </>
      )}
    </main>
  );
}
