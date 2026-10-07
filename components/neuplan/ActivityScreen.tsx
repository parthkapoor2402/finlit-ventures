"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { HYPOTHESIS_LINE } from "@/lib/labels";
import type { AnalyticsEvent, AnalyticsEventName } from "@/lib/types";
import { SectionNav } from "./SectionNav";
import styles from "./WeekScreen.module.css";

const LINES: Record<AnalyticsEventName, string> = {
  neuplan_discovered: "Saw NeuPlan",
  neuplan_open: "Opened NeuPlan",
  neuplan_intro_viewed: "Read the intro",
  neuplan_setup_started: "Started setup",
  neuplan_onboarding_complete: "Finished setup",
  week_view_open: "Looked at the week",
  week_item_created: "Added a plan",
  week_item_completed: "Marked a plan done",
  need_created: "Added a need",
  need_viewed: "Opened a need",
  need_updated: "Updated a need",
  need_resolved: "Resolved a need",
  tata_resolution_shown: "Saw a Tata stop that fits",
  tata_resolution_viewed: "Opened a demo Tata stop",
  tata_resolution_clicked: "Chose a demo Tata stop",
  commerce_intent: "Started a demo Tata stop",
  commerce_demo_opened: "Viewed a demo catalogue",
  ai_summary_requested: "Asked for a summary",
  ai_summary_generated: "Wrote a weekly summary",
  ai_summary_fallback: "Used the app summary",
  return_session: "Came back",
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
