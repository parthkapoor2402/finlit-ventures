"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { parseIntent } from "@/lib/intent/parse";
import { NEED_TYPE_LABELS, formatDayLabel } from "@/lib/labels";
import { resolutionReason } from "@/lib/resolve";
import { resolveNeed } from "@/lib/tata/resolutionEngine";
import { markMeaningfulSession, track } from "@/lib/track";
import { NEED_TYPES, type NeedType, type Week } from "@/lib/types";
import styles from "./Plan.module.css";

const TIMES = [
  { id: "", label: "No specific time" },
  { id: "09:00", label: "Morning" },
  { id: "14:00", label: "Afternoon" },
  { id: "19:00", label: "Evening" },
] as const;

export function AddNeedScreen() {
  const router = useRouter();
  const [week, setWeek] = useState<Week | null>(null);
  const [type, setType] = useState<NeedType>("replace");
  const [title, setTitle] = useState("");
  const [when, setWhen] = useState<"today" | "tomorrow" | "week" | "pick">("week");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
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

  const split = title.trim() ? parseIntent(title) : null;
  const several = (split?.suggestions.length ?? 0) >= 2;
  const previewLine =
    split &&
    split.suggestions.length === 1 &&
    split.suggestions[0] &&
    split.suggestions[0].title.trim().toLowerCase() !== title.trim().toLowerCase()
      ? split.suggestions[0]
      : null;
  const suggestion = previewLine
    ? resolveNeed(previewLine.type, previewLine.title)
    : title.trim() && !several
      ? resolveNeed(type, title)
      : null;
  const chosenDay = resolveDay(when, day, week);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    const response = await fetch("/api/needs", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type,
        title,
        day: chosenDay,
        time: time || null,
      }),
    });
    const body = (await response.json()) as {
      need?: { id: string; type?: string };
      needs?: { id: string; type: string }[];
      moment?: { id: string };
      message?: string;
    };
    if (!response.ok || (!body.need && !body.moment)) {
      setError(body.message ?? "We could not add that need.");
      setPending(false);
      return;
    }
    if (body.needs && body.needs.length > 1) {
      for (const line of body.needs) {
        await track("need_created", { type: line.type });
      }
      await markMeaningfulSession();
      router.push("/neuplan");
      return;
    }
    await track("need_created", { type: body.need?.type ?? type });
    await markMeaningfulSession();
    router.push(`/neuplan/needs/${body.need?.id}`);
  }

  return (
    <main className={styles.page}>
      <p className={styles.kicker}>NEUPLAN</p>
      <h1 className={styles.title}>Add a need</h1>
      <p className={styles.lead}>What is something you want to take care of?</p>
      <form onSubmit={(event) => void submit(event)}>
        <p className={styles.step}>WHAT DO YOU WANT TO DO?</p>
        <ul className={styles.chips}>
          {NEED_TYPES.map((entry) => (
            <li key={entry}>
              <button type="button" aria-pressed={type === entry} onClick={() => setType(entry)}>
                {NEED_TYPE_LABELS[entry]}
              </button>
            </li>
          ))}
        </ul>
        <label className={styles.note}>
          What is it?
          <textarea
            value={title}
            required
            maxLength={240}
            placeholder="e.g. Replace my charger"
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>
        <p className={styles.step}>WHEN?</p>
        <ul className={styles.chips}>
          {(
            [
              ["today", "Today"],
              ["tomorrow", "Tomorrow"],
              ["week", "This week"],
              ["pick", "Choose a day"],
            ] as const
          ).map(([id, label]) => (
            <li key={id}>
              <button type="button" aria-pressed={when === id} onClick={() => setWhen(id)}>
                {label}
              </button>
            </li>
          ))}
        </ul>
        {when === "pick" && week ? (
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
        <p className={styles.step}>TIME, IF IT MATTERS</p>
        <ul className={styles.chips}>
          {TIMES.map((entry) => (
            <li key={entry.label}>
              <button type="button" aria-pressed={time === entry.id} onClick={() => setTime(entry.id)}>
                {entry.label}
              </button>
            </li>
          ))}
        </ul>
        <section className={styles.section} aria-labelledby="help-line">
          <h2 id="help-line">TATA NEU CAN HELP WITH THIS</h2>
          {several && split ? (
            <ul className={styles.list}>
              {split.suggestions.map((line) => {
                const stop = resolveNeed(line.type, line.title);
                return (
                  <li key={line.title}>
                    {line.title}
                    {stop ? ` → ${stop.label}` : ""}
                  </li>
                );
              })}
            </ul>
          ) : suggestion ? (
            <p className={styles.lead}>
              {previewLine ? `${previewLine.title} → ${suggestion.label}. ` : `${suggestion.label}. `}
              {resolutionReason(suggestion.destination)}. This is a demo stop, not live stock.
            </p>
          ) : (
            <p className={styles.lead}>Tata Neu cannot finish this.</p>
          )}
        </section>
        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}
        <div className={styles.actions}>
          <button className={styles.primaryLink} type="submit" disabled={pending || title.trim().length === 0}>
            Save need
          </button>
        </div>
      </form>
    </main>
  );
}

function resolveDay(when: "today" | "tomorrow" | "week" | "pick", picked: string, week: Week | null): string | null {
  if (!week) return null;
  if (when === "week") return null;
  if (when === "pick") return picked || null;
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const index = week.days.indexOf(today);
  if (when === "today") return index >= 0 ? today : null;
  return index >= 0 ? (week.days[index + 1] ?? null) : null;
}
