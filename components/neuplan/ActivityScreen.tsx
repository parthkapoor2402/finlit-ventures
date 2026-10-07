"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { HYPOTHESIS_LINE } from "@/lib/labels";
import type { AnalyticsEvent, AnalyticsEventName } from "@/lib/types";
import { SectionNav } from "./SectionNav";
import styles from "./WeekScreen.module.css";

const LINES: Record<AnalyticsEventName, string> = {
  neuplan_open: "Opened NeuPlan",
  neuplan_onboarding_complete: "Finished onboarding",
  week_view_open: "Looked at the week",
  week_item_created: "Added a week item",
  week_item_completed: "Marked a week item done",
  need_created: "Added a need",
  need_resolved: "Resolved a need",
  tata_resolution_viewed: "Opened a demo Tata stop",
  tata_resolution_clicked: "Chose a demo Tata stop",
  ai_summary_generated: "Wrote a weekly summary",
  ai_summary_fallback: "Used the app summary",
  session_meaningful: "Did something they started",
};

export function ActivityScreen() {
  const [events, setEvents] = useState<AnalyticsEvent[] | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch("/api/activity");
        const body = (await response.json()) as { events?: AnalyticsEvent[] };
        if (!response.ok || !body.events) throw new Error("activity");
        if (!cancelled) setEvents(body.events);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className={styles.page}>
      <p className={styles.banner}>DEMO DATA</p>
      <h1 className={styles.title}>Activity</h1>
      <p className={styles.descriptor}>What happened in this prototype. Not a score.</p>
      <p className={styles.hypothesis}>{HYPOTHESIS_LINE} Not measured. Not achieved.</p>
      <SectionNav current="activity" />
      {loading ? <Skeleton label="Loading activity" /> : null}
      {error ? (
        <p className={styles.error} role="alert">
          We could not load activity.
        </p>
      ) : null}
      {events && events.length === 0 ? <p className={styles.empty}>Nothing has been recorded in this prototype yet.</p> : null}
      {events && events.length > 0 ? (
        <ol className={styles.items}>
          {events.map((event) => (
            <li key={event.id}>
              <p className={styles.itemTitle}>{LINES[event.name]}</p>
              <p className={styles.metaLine}>{event.at}</p>
            </li>
          ))}
        </ol>
      ) : null}
      {error ? <Button onClick={() => window.location.reload()}>Try again</Button> : null}
    </main>
  );
}
