"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { HYPOTHESIS_LINE } from "@/lib/labels";
import type { AIInsight } from "@/lib/types";
import { SectionNav } from "./SectionNav";
import styles from "./WeekScreen.module.css";

export function SummaryScreen() {
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [cached, setCached] = useState(false);
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);

  async function summarise() {
    setPending(true);
    setError(false);
    try {
      const response = await fetch("/api/ai/weekly-summary", { method: "POST" });
      const body = (await response.json()) as { insight?: AIInsight; cached?: boolean };
      if (!response.ok || !body.insight) throw new Error("summary");
      setInsight(body.insight);
      setCached(Boolean(body.cached));
    } catch {
      setError(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <main className={styles.page}>
      <p className={styles.banner}>DEMO DATA</p>
      <h1 className={styles.title}>Summary</h1>
      <p className={styles.descriptor}>A note from the counts already on this week. Not a new plan.</p>
      <p className={styles.hypothesis}>{HYPOTHESIS_LINE} Not measured. Not achieved.</p>
      <SectionNav current="summary" />
      <Button onClick={() => void summarise()} disabled={pending}>
        Summarise this week
      </Button>
      {error ? (
        <div>
          <p className={styles.error} role="alert">
            {"We couldn't write the summary."}
          </p>
          <Button onClick={() => void summarise()}>Try again</Button>
        </div>
      ) : null}
      {insight ? (
        <article className={styles.day}>
          <p>{insight.text}</p>
          <p className={styles.metaLine}>{insight.source === "gemini" ? "Model" : "Written by the app"}</p>
          {cached ? <p className={styles.metaLine}>The week has not changed.</p> : null}
        </article>
      ) : null}
    </main>
  );
}
