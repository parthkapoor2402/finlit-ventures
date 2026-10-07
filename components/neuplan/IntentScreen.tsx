"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Glyph } from "@/components/ui/Glyph";
import type { ParsedIntent } from "@/lib/intent/parse";
import { markMeaningfulSession, track } from "@/lib/track";
import styles from "./Plan.module.css";

const CHIPS = [
  { id: "going", label: "Going somewhere", sentence: "Going home this weekend" },
  { id: "buy", label: "Something to buy", sentence: "I need to buy " },
  { id: "fix", label: "Something to fix", sentence: "My charger stopped working" },
  { id: "exam", label: "Exam week", sentence: "My exams start Monday" },
  { id: "friends", label: "Friends coming", sentence: "Friends are coming Saturday" },
  { id: "weekend", label: "Weekend plan", sentence: "Planning the weekend" },
  { id: "birthday", label: "Birthday", sentence: "I need a birthday gift" },
  { id: "other", label: "Something else", sentence: "" },
] as const;

const HOW = [
  { icon: "plan" as const, title: "Tell us", body: "what is happening" },
  { icon: "check" as const, title: "Build your plan", body: "keep the lines you want" },
  { icon: "bag" as const, title: "Get it done", body: "only if a Tata stop fits" },
];

export function IntentScreen({ onCreated }: { onCreated?: () => void }) {
  const router = useRouter();
  const started = useRef(false);
  const [sentence, setSentence] = useState("");
  const [chip, setChip] = useState("");
  const [how, setHow] = useState(false);
  const [intent, setIntent] = useState<ParsedIntent | null>(null);
  const [checked, setChecked] = useState<boolean[]>([]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    void track("intent_started", { source: "intent" });
  }, []);

  function noteStart() {
    if (started.current) return;
    started.current = true;
  }

  function chooseChip(id: string, next: string) {
    noteStart();
    setChip(id);
    setSentence(next);
    setIntent(null);
    setError("");
  }

  async function showLines() {
    const text = sentence.trim();
    if (!text) {
      setError("Add a sentence.");
      return;
    }
    setPending(true);
    setError("");
    await track("intent_submitted", { source: chip || "text" });
    try {
      const response = await fetch("/api/ai/intent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const body = (await response.json()) as { intent?: ParsedIntent; message?: string };
      if (!response.ok || !body.intent) {
        setError(body.message ?? "We could not read that.");
        return;
      }
      if (body.intent.suggestions.length === 0) {
        setError("Add a sentence.");
        return;
      }
      setIntent(body.intent);
      setChecked(body.intent.suggestions.map((line) => line.selectedByDefault));
    } catch {
      setError("We could not read that.");
    } finally {
      setPending(false);
    }
  }

  async function confirm() {
    if (!intent) return;
    const lines = intent.suggestions.filter((_, index) => checked[index]);
    if (lines.length === 0) {
      setError("Keep at least one line.");
      return;
    }
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/moments", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: intent.title,
          kind: intent.kind,
          day: intent.day,
          lines: lines.map((line) => ({ title: line.title, type: line.type })),
        }),
      });
      const body = (await response.json()) as { moment?: { id: string }; message?: string };
      if (!response.ok || !body.moment) {
        setError(body.message ?? "We could not save that.");
        setPending(false);
        return;
      }
      await track("moment_created", { type: intent.kind });
      await track("plan_created", { type: intent.kind });
      for (const line of lines) {
        await track("need_created", { type: line.type });
      }
      await markMeaningfulSession();
      if (onCreated) onCreated();
      else router.push("/neuplan");
    } catch {
      setError("We could not save that.");
      setPending(false);
    }
  }

  const kept = checked.some(Boolean);

  return (
    <main className={styles.page}>
      <p className={styles.kicker}>NEUPLAN</p>
      <h1 className={styles.title}>What are you up to?</h1>
      <p className={styles.lead}>{"Tell us what's happening. We'll line up what you need."}</p>
      <ul className={styles.chips}>
        {CHIPS.map((entry) => (
          <li key={entry.id}>
            <button
              type="button"
              aria-pressed={chip === entry.id}
              onClick={() => chooseChip(entry.id, entry.sentence)}
            >
              {entry.label}
            </button>
          </li>
        ))}
      </ul>
      <label className={styles.note}>
        What is happening?
        <textarea
          value={sentence}
          maxLength={200}
          placeholder="A charger, a trip, exams, people coming"
          onChange={(event) => {
            noteStart();
            setSentence(event.target.value);
            setIntent(null);
          }}
        />
      </label>
      {intent ? (
        <section className={styles.section} aria-labelledby="lines">
          <h2 id="lines">KEEP WHAT YOU WANT</h2>
          <p className={styles.meta}>{intent.title}</p>
          <ul className={styles.checkList}>
            {intent.suggestions.map((line, index) => (
              <li key={`${line.title}-${index}`}>
                <label>
                  <input
                    type="checkbox"
                    checked={Boolean(checked[index])}
                    onChange={() => {
                      setChecked((current) => current.map((value, item) => (item === index ? !value : value)));
                    }}
                  />
                  <span>{line.title}</span>
                </label>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
      <div className={styles.actions}>
        {intent ? (
          <button type="button" className={styles.primaryLink} disabled={pending || !kept} onClick={() => void confirm()}>
            Confirm
          </button>
        ) : (
          <button
            type="button"
            className={styles.primaryLink}
            disabled={pending || sentence.trim().length === 0}
            onClick={() => void showLines()}
          >
            Show lines
          </button>
        )}
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.textButton} aria-expanded={how} onClick={() => setHow((value) => !value)}>
          See how it works
        </button>
      </div>
      {how ? (
        <ol className={styles.how}>
          {HOW.map((line) => (
            <li key={line.title}>
              <span className={styles.icon}>
                <Glyph name={line.icon} />
              </span>
              <span>
                <strong>{line.title}</strong>
                <span>{line.body}</span>
              </span>
            </li>
          ))}
        </ol>
      ) : null}
    </main>
  );
}
