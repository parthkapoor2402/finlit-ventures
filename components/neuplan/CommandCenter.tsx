"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { HYPOTHESIS_LINE, LIVING_LABELS, WEEK_SHAPE_LABELS, formatClock, formatDayLabel, greeting } from "@/lib/labels";
import { resolutionReason, suggestResolution } from "@/lib/resolve";
import { markMeaningfulSession, track } from "@/lib/track";
import type { Need, Notice, User, Week, WeekItem } from "@/lib/types";
import { SectionNav } from "./SectionNav";
import styles from "./Plan.module.css";

export function CommandCenter({ user }: { user: User }) {
  const [week, setWeek] = useState<Week | null>(null);
  const [needs, setNeeds] = useState<Need[] | null>(null);
  const [notices, setNotices] = useState<Notice[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [weekResponse, needsResponse, noticeResponse, visitResponse] = await Promise.all([
          fetch("/api/week"),
          fetch("/api/needs"),
          fetch("/api/notices"),
          fetch("/api/visit", { method: "POST" }),
        ]);
        const weekBody = (await weekResponse.json()) as { week?: Week };
        const needsBody = (await needsResponse.json()) as { needs?: Need[] };
        const noticeBody = (await noticeResponse.json()) as { notices?: Notice[] };
        const visitBody = (await visitResponse.json()) as { returning?: boolean };
        if (!weekResponse.ok || !weekBody.week || !needsResponse.ok || !needsBody.needs) {
          throw new Error("week");
        }
        if (cancelled) return;
        setWeek(weekBody.week);
        setNeeds(needsBody.needs);
        setNotices(noticeBody.notices ?? []);
        setError(false);
        if (visitBody.returning) await track("return_session", { source: "week" });
        await track("week_view_open", { source: "entry" });
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
  }, [reloadToken]);

  function refresh() {
    setLoading(true);
    setError(false);
    setReloadToken((value) => value + 1);
  }

  async function markDone(item: WeekItem) {
    const response = await fetch(`/api/week/items/${item.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ state: item.state === "done" ? "planned" : "done" }),
    });
    if (!response.ok) {
      setError(true);
      return;
    }
    if (item.state !== "done") {
      await track("week_item_completed", { type: item.type, state: "done" });
      await markMeaningfulSession();
    }
    refresh();
  }

  async function dismiss() {
    await fetch("/api/notices", { method: "POST" });
    setNotices([]);
  }

  const living = user.livingSituation ? LIVING_LABELS[user.livingSituation] : "Not set";
  const openNeeds = (needs ?? []).filter((need) => need.state !== "resolved");
  const help = openNeeds.flatMap((need) => {
    const destination = suggestResolution(need.type, need.title);
    return destination ? [{ need, destination }] : [];
  });

  return (
    <main className={styles.page}>
      <p className={styles.kicker}>NEUPLAN</p>
      <h1 className={styles.title}>
        {greeting()}, {user.displayName}
      </h1>
      <p className={styles.lead}>Stay on top of what matters this week.</p>
      <p className={styles.demo}>DEMO DATA · {living}</p>
      <p className={styles.hypothesis}>{HYPOTHESIS_LINE} Not measured. Not achieved.</p>
      <SectionNav current="week" />
      {loading && !week ? <Skeleton label="Opening your week" /> : null}
      {error ? (
        <div className={styles.section}>
          <p className={styles.error} role="alert">
            We could not refresh your week.
          </p>
          <Button onClick={refresh}>Try again</Button>
        </div>
      ) : null}
      {week && needs && !error ? (
        <>
          <section className={styles.section} aria-labelledby="attention">
            <h2 id="attention">WHAT NEEDS ATTENTION</h2>
            {openNeeds.length === 0 ? (
              <p className={styles.empty}>Nothing is waiting on you.</p>
            ) : (
              <>
                <p className={styles.meta}>
                  {openNeeds.length} {openNeeds.length === 1 ? "thing needs" : "things need"} attention
                </p>
                <ul className={styles.list}>
                  {openNeeds.map((need) => (
                    <li key={need.id}>
                      <Link className={styles.rowLink} href={`/neuplan/needs/${need.id}`}>
                        <span>
                          <p className={styles.itemTitle}>{need.title}</p>
                          <p className={styles.metaLine}>
                            {need.state === "exploring" ? "Exploring" : "Still open"}
                            {need.day ? ` · ${formatDayLabel(need.day)}` : ""}
                          </p>
                        </span>
                        <span aria-hidden="true">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>

          <section className={styles.section} aria-labelledby="quick">
            <h2 id="quick">QUICK ADD</h2>
            <div className={styles.quick}>
              <Link href="/neuplan/needs/new">+ Add a need</Link>
              <Link href="/neuplan/plan">+ Add a plan</Link>
            </div>
          </section>

          {help.length > 0 ? (
            <section className={styles.section} aria-labelledby="tata">
              <h2 id="tata">TATA CAN HELP</h2>
              <div className={styles.help}>
                {help.map(({ need, destination }) => (
                  <Link key={need.id} href={`/neuplan/needs/${need.id}`}>
                    <strong>{need.title}</strong>
                    <span>
                      {resolutionReason(destination)}. Demo only.
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <section className={styles.section} aria-labelledby="changed">
            <h2 id="changed">WHAT CHANGED</h2>
            {notices && notices.length > 0 ? (
              <>
                <ul className={styles.list}>
                  {notices.map((notice) => (
                    <li key={notice.id} className={styles.notice}>
                      {notice.text}
                    </li>
                  ))}
                </ul>
                <Button variant="secondary" onClick={() => void dismiss()}>
                  Got it
                </Button>
              </>
            ) : (
              <p className={styles.empty}>Nothing has changed since you last looked.</p>
            )}
          </section>

          <section className={styles.section} aria-labelledby="week">
            <h2 id="week">YOUR WEEK</h2>
            <p className={styles.meta}>
              {formatDayLabel(week.startsOn)} – {formatDayLabel(week.endsOn)}
            </p>
            {week.items.length === 0 && needs.length === 0 ? (
              <p className={styles.empty}>Start with one thing you want to take care of this week.</p>
            ) : (
              <WeekList week={week} needs={needs} onDone={(item) => void markDone(item)} />
            )}
          </section>
        </>
      ) : null}
    </main>
  );
}

function WeekList({
  week,
  needs,
  onDone,
}: {
  week: Week;
  needs: Need[];
  onDone: (item: WeekItem) => void;
}) {
  const activeDays = week.days.filter(
    (day) => week.items.some((item) => item.day === day) || needs.some((need) => need.day === day),
  );
  if (activeDays.length === 0) {
    return <p className={styles.empty}>Your plans are not tied to a day yet.</p>;
  }
  return (
    <ol className={styles.example}>
      {activeDays.map((day) => (
        <li key={day}>
          <span className={styles.day}>{formatDayLabel(day).slice(0, 3).toUpperCase()}</span>
          <div>
            {week.items
              .filter((item) => item.day === day)
              .map((item) => (
                <div key={item.id} className={item.state === "done" ? styles.done : undefined}>
                  <p className={styles.itemTitle}>{item.title}</p>
                  <p className={styles.metaLine}>
                    {WEEK_SHAPE_LABELS[item.type]}
                    {item.time ? ` · ${formatClock(item.time)}` : ""} · {item.state === "done" ? "Done" : "Planned"}
                  </p>
                  <div className={styles.rowActions}>
                    <Button variant="secondary" onClick={() => onDone(item)}>
                      {item.state === "done" ? "Mark planned" : "Mark done"}
                    </Button>
                  </div>
                </div>
              ))}
            {needs
              .filter((need) => need.day === day)
              .map((need) => (
                <p key={need.id}>
                  <Link href={`/neuplan/needs/${need.id}`}>{need.title}</Link>
                </p>
              ))}
          </div>
        </li>
      ))}
    </ol>
  );
}
