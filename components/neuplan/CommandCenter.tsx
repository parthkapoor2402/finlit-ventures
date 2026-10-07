"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatDayLabel, greeting } from "@/lib/labels";
import { resolutionReason } from "@/lib/resolve";
import { resolveNeed } from "@/lib/tata/resolutionEngine";
import { markMeaningfulSession, track } from "@/lib/track";
import type { Moment, Need, Notice, User, Week, WeekItem } from "@/lib/types";
import { SectionNav } from "./SectionNav";
import styles from "./Plan.module.css";

export function CommandCenter({ user }: { user: User }) {
  const [week, setWeek] = useState<Week | null>(null);
  const [needs, setNeeds] = useState<Need[] | null>(null);
  const [moments, setMoments] = useState<Moment[] | null>(null);
  const [notices, setNotices] = useState<Notice[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [weekResponse, needsResponse, momentResponse, noticeResponse, visitResponse] = await Promise.all([
          fetch("/api/week"),
          fetch("/api/needs"),
          fetch("/api/moments"),
          fetch("/api/notices"),
          fetch("/api/visit", { method: "POST" }),
        ]);
        const weekBody = (await weekResponse.json()) as { week?: Week };
        const needsBody = (await needsResponse.json()) as { needs?: Need[] };
        const momentBody = (await momentResponse.json()) as { moments?: Moment[] };
        const noticeBody = (await noticeResponse.json()) as { notices?: Notice[] };
        const visitBody = (await visitResponse.json()) as { returning?: boolean };
        if (!weekResponse.ok || !weekBody.week || !needsResponse.ok || !needsBody.needs || !momentResponse.ok) {
          throw new Error("open");
        }
        if (cancelled) return;
        setWeek(weekBody.week);
        setNeeds(needsBody.needs);
        setMoments(momentBody.moments ?? []);
        setNotices(noticeBody.notices ?? []);
        setError(false);
        if (visitBody.returning) await track("return_session", { source: "now" });
        if ((momentBody.moments ?? []).some((moment) => moment.status === "open")) {
          await track("moment_viewed", { source: "now" });
        }
        const dated = needsBody.needs.some((need) => need.day) || (momentBody.moments ?? []).some((moment) => moment.day);
        if (dated) await track("week_view_open", { source: "dated" });
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

  const openNeeds = (needs ?? []).filter((need) => need.state !== "resolved");
  const openMoments = (moments ?? []).filter((moment) => moment.status === "open");
  const help = openNeeds.flatMap((need) => {
    const resolution = resolveNeed(need.type, need.title);
    return resolution ? [{ need, resolution }] : [];
  });
  const waiting = openNeeds.length > 0 || openMoments.length > 0;

  return (
    <main className={styles.page}>
      <p className={styles.kicker}>NEUPLAN</p>
      <h1 className={styles.title}>
        {greeting()}, {user.displayName}
      </h1>
      <p className={styles.lead}>What is still open.</p>
      <p className={styles.demo}>DEMO DATA</p>
      <SectionNav current="now" />
      {loading && !week ? <Skeleton label="Opening what is happening" /> : null}
      {error ? (
        <div className={styles.section}>
          <p className={styles.error} role="alert">
            We could not refresh what is open.
          </p>
          <Button onClick={refresh}>Try again</Button>
        </div>
      ) : null}
      {week && needs && moments && !error ? (
        <>
          <section className={styles.section} aria-labelledby="attention">
            <h2 id="attention">WHAT IS OPEN</h2>
            {waiting ? (
              <ul className={styles.list}>
                {openMoments.map((moment) => {
                  const lines = openNeeds.filter((need) => need.momentId === moment.id);
                  return (
                    <li key={moment.id}>
                      <p className={styles.itemTitle}>{moment.title}</p>
                      <p className={styles.metaLine}>{moment.day ? formatDayLabel(moment.day) : "No date"}</p>
                      {lines.map((need) => (
                        <p key={need.id} className={styles.metaLine}>
                          <Link href={`/neuplan/needs/${need.id}`}>
                            {need.title}
                            {need.state === "exploring" ? " · Exploring" : ""}
                          </Link>
                        </p>
                      ))}
                    </li>
                  );
                })}
                {openNeeds
                  .filter((need) => !need.momentId || !openMoments.some((moment) => moment.id === need.momentId))
                  .map((need) => (
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
            ) : (
              <p className={styles.empty}>Nothing is waiting on you.</p>
            )}
            <div className={styles.actions}>
              <Link className={styles.primaryLink} href="/neuplan/new">
                Add something
              </Link>
            </div>
          </section>

          {help.length > 0 ? (
            <section className={styles.section} aria-labelledby="tata">
              <h2 id="tata">TATA CAN HELP</h2>
              <div className={styles.help}>
                {help.map(({ need, resolution }) => (
                  <Link key={need.id} href={`/neuplan/needs/${need.id}`}>
                    <strong>{need.title}</strong>
                    <span>
                      {resolution.label}. {resolutionReason(resolution.destination)}. Demo only.
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

          <DatedWeek week={week} needs={needs} moments={moments} onDone={(item) => void markDone(item)} />
        </>
      ) : null}
    </main>
  );
}

function DatedWeek({
  week,
  needs,
  moments,
  onDone,
}: {
  week: Week;
  needs: Need[];
  moments: Moment[];
  onDone: (item: WeekItem) => void;
}) {
  const activeDays = week.days.filter(
    (day) =>
      week.items.some((item) => item.day === day) ||
      needs.some((need) => need.day === day) ||
      moments.some((moment) => moment.day === day),
  );
  if (activeDays.length === 0) return null;
  return (
    <section className={styles.section} id="week" aria-labelledby="week-label">
      <h2 id="week-label">THIS WEEK</h2>
      <p className={styles.meta}>Only the days that already have a date.</p>
      <ol className={styles.example}>
        {activeDays.map((day) => (
          <li key={day}>
            <span className={styles.day}>{formatDayLabel(day).slice(0, 3).toUpperCase()}</span>
            <div>
              {moments
                .filter((moment) => moment.day === day)
                .map((moment) => (
                  <p key={moment.id} className={styles.itemTitle}>
                    {moment.title}
                  </p>
                ))}
              {needs
                .filter((need) => need.day === day)
                .map((need) => (
                  <p key={need.id}>
                    <Link href={`/neuplan/needs/${need.id}`}>{need.title}</Link>
                  </p>
                ))}
              {week.items
                .filter((item) => item.day === day)
                .map((item) => (
                  <div key={item.id} className={item.state === "done" ? styles.done : undefined}>
                    <p className={styles.itemTitle}>{item.title}</p>
                    <div className={styles.rowActions}>
                      <Button variant="secondary" onClick={() => onDone(item)}>
                        {item.state === "done" ? "Mark planned" : "Mark done"}
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
