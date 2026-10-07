"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { WEEK_SHAPE_LABELS, formatDayLabel } from "@/lib/labels";
import { markMeaningfulSession, track } from "@/lib/track";
import { WEEK_SHAPES, type Week, type WeekShape } from "@/lib/types";
import styles from "./Plan.module.css";

export function AddPlanScreen() {
  const router = useRouter();
  const [week, setWeek] = useState<Week | null>(null);
  const [type, setType] = useState<WeekShape>("classes");
  const [title, setTitle] = useState("");
  const [day, setDay] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    void fetch("/api/week")
      .then((response) => response.json())
      .then((body: { week?: Week }) => {
        if (body.week) {
          setWeek(body.week);
          setDay(body.week.days[0] ?? "");
        }
      });
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!day) return;
    setPending(true);
    setError("");
    const response = await fetch("/api/week/items", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type, title, day, time: null, tataDestination: null }),
    });
    const body = (await response.json()) as { message?: string };
    if (!response.ok) {
      setError(body.message ?? "We could not add that.");
      setPending(false);
      return;
    }
    await track("week_item_created", { type });
    await markMeaningfulSession();
    router.push("/neuplan");
  }

  return (
    <main className={styles.page}>
      <p className={styles.kicker}>NEUPLAN</p>
      <h1 className={styles.title}>Add a plan</h1>
      <p className={styles.lead}>Something you already know is happening. Time is optional, and there is no shop attached.</p>
      <form onSubmit={(event) => void submit(event)}>
        <ul className={styles.chips}>
          {WEEK_SHAPES.map((shape) => (
            <li key={shape}>
              <button type="button" aria-pressed={type === shape} onClick={() => setType(shape)}>
                {WEEK_SHAPE_LABELS[shape]}
              </button>
            </li>
          ))}
        </ul>
        <label className={styles.note}>
          What is it?
          <textarea value={title} required maxLength={80} onChange={(event) => setTitle(event.target.value)} />
        </label>
        {week ? (
          <ul className={styles.chips}>
            {week.days.map((entry) => (
              <li key={entry}>
                <button type="button" aria-pressed={day === entry} onClick={() => setDay(entry)}>
                  {formatDayLabel(entry)}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}
        <div className={styles.actions}>
          <button className={styles.primaryLink} type="submit" disabled={pending || !title.trim() || !day}>
            Save plan
          </button>
        </div>
      </form>
    </main>
  );
}
