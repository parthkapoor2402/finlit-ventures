"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SelectField, TextField } from "@/components/ui/TextField";
import { Skeleton } from "@/components/ui/Skeleton";
import { listCatalogue } from "@/lib/catalogue";
import { HYPOTHESIS_LINE, LIVING_LABELS, WEEK_SHAPE_LABELS, formatClock, formatDayLabel } from "@/lib/labels";
import { markMeaningfulSession, track } from "@/lib/track";
import type { TataDestination, User, Week, WeekItem, WeekShape } from "@/lib/types";
import { WEEK_SHAPES } from "@/lib/types";
import { weekRange, zonedParts } from "@/lib/week";
import { SectionNav } from "./SectionNav";
import styles from "./WeekScreen.module.css";

interface ItemDraft {
  type: WeekShape;
  title: string;
  day: string;
  time: string;
  tataDestination: string;
}

function todayIso(days: readonly string[]): string {
  const zoned = zonedParts(new Date());
  const iso = `${zoned.year}-${String(zoned.month).padStart(2, "0")}-${String(zoned.day).padStart(2, "0")}`;
  if (days.includes(iso)) return iso;
  return days[0] ?? weekRange(new Date()).startsOn;
}

function blankDraft(day: string): ItemDraft {
  return { type: "personal", title: "", day, time: "", tataDestination: "" };
}

export function WeekScreen({ user }: { user: User }) {
  const [week, setWeek] = useState<Week | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);
  const [draft, setDraft] = useState<ItemDraft | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const [removed, setRemoved] = useState<WeekItem | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch("/api/week");
        const body = (await response.json()) as { week?: Week };
        if (!response.ok || !body.week) throw new Error("week");
        if (cancelled) return;
        const loaded = body.week;
        setWeek(loaded);
        setDraft((current) => current ?? blankDraft(todayIso(loaded.days)));
        setError(false);
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

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft) return;
    setFormError("");
    const payload = {
      type: draft.type,
      title: draft.title,
      day: draft.day,
      time: draft.time || null,
      tataDestination: draft.tataDestination || null,
    };
    const response = await fetch(editingId ? `/api/week/items/${editingId}` : "/api/week/items", {
      method: editingId ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = (await response.json()) as { message?: string };
    if (!response.ok) {
      setFormError(body.message ?? "We couldn't add that.");
      return;
    }
    if (!editingId) {
      await track("week_item_created", { type: draft.type });
      await markMeaningfulSession();
    }
    setEditingId(null);
    setDraft(blankDraft(draft.day));
    refresh();
  }

  async function markDone(item: WeekItem) {
    const next = item.state === "done" ? "planned" : "done";
    const response = await fetch(`/api/week/items/${item.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ state: next }),
    });
    if (!response.ok) {
      setFormError("We couldn't update that.");
      return;
    }
    if (next === "done") {
      await track("week_item_completed", { type: item.type, state: "done" });
      await markMeaningfulSession();
    }
    refresh();
  }

  async function remove(item: WeekItem) {
    const response = await fetch(`/api/week/items/${item.id}`, { method: "DELETE" });
    const body = (await response.json()) as { item?: WeekItem; message?: string };
    if (!response.ok || !body.item) {
      setFormError(body.message ?? "We couldn't remove that.");
      return;
    }
    setRemoved(body.item);
    refresh();
  }

  async function undo() {
    if (!removed) return;
    const response = await fetch("/api/week/items", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type: removed.type,
        title: removed.title,
        day: removed.day,
        time: removed.time,
        tataDestination: removed.tataDestination,
      }),
    });
    if (response.ok) setRemoved(null);
    refresh();
  }

  const living = user.livingSituation ? LIVING_LABELS[user.livingSituation] : "Not set";

  return (
    <main className={styles.page}>
      <p className={styles.banner}>DEMO DATA</p>
      <h1 className={styles.title}>NeuPlan</h1>
      <p className={styles.descriptor}>Your week. Planned around what matters.</p>
      <p className={styles.hypothesis}>{HYPOTHESIS_LINE} Not measured. Not achieved.</p>
      <p className={styles.meta}>
        {user.displayName} · {living}
      </p>
      <SectionNav current="week" />
      {loading && !week ? <Skeleton label="Loading your week" /> : null}
      {error ? (
        <div>
          <p className={styles.error} role="alert">
            {"We couldn't refresh your week."}
          </p>
          <Button onClick={refresh}>Try again</Button>
        </div>
      ) : null}
      {week && !error ? <WeekBody week={week} onEdit={(item) => startEdit(item)} onDone={(item) => void markDone(item)} onRemove={(item) => void remove(item)} editingId={editingId} /> : null}
      {week && draft && !error ? (
        <form className={styles.form} onSubmit={(event) => void submit(event)}>
          <h2 id="add-something">{editingId ? "Edit" : "Add something"}</h2>
          <SelectField
            label="Type"
            value={draft.type}
            onChange={(event) => setDraft({ ...draft, type: event.target.value as WeekShape })}
          >
            {WEEK_SHAPES.map((shape) => (
              <option key={shape} value={shape}>
                {WEEK_SHAPE_LABELS[shape]}
              </option>
            ))}
          </SelectField>
          <TextField
            id="item-title"
            label="Title"
            value={draft.title}
            onChange={(event) => setDraft({ ...draft, title: event.target.value })}
          />
          <SelectField label="Day" value={draft.day} onChange={(event) => setDraft({ ...draft, day: event.target.value })}>
            {week.days.map((day) => (
              <option key={day} value={day}>
                {formatDayLabel(day)}
              </option>
            ))}
          </SelectField>
          <TextField
            label="Time"
            type="time"
            value={draft.time}
            hint="Optional."
            onChange={(event) => setDraft({ ...draft, time: event.target.value })}
          />
          <SelectField
            label="Demo Tata stop"
            value={draft.tataDestination}
            hint="Optional. Not a live catalogue."
            onChange={(event) => setDraft({ ...draft, tataDestination: event.target.value })}
          >
            <option value="">None</option>
            {listCatalogue().map((entry) => (
              <option key={entry.destination} value={entry.destination}>
                {entry.label}
              </option>
            ))}
          </SelectField>
          {formError ? (
            <p className={styles.error} role="alert">
              {formError}
            </p>
          ) : null}
          <Button type="submit">{editingId ? "Save" : "Add something"}</Button>
        </form>
      ) : null}
      <Link className={styles.home} href="/">
        Home
      </Link>
      {removed ? (
        <div className={styles.undo} role="status">
          <span>Removed.</span>
          <Button variant="secondary" onClick={() => void undo()}>
            Undo
          </Button>
        </div>
      ) : null}
    </main>
  );

  function startEdit(item: WeekItem) {
    setEditingId(item.id);
    setDraft({
      type: item.type,
      title: item.title,
      day: item.day,
      time: item.time ?? "",
      tataDestination: item.tataDestination ?? "",
    });
    document.getElementById("item-title")?.focus();
  }
}

function WeekBody({
  week,
  editingId,
  onEdit,
  onDone,
  onRemove,
}: {
  week: Week;
  editingId: string | null;
  onEdit: (item: WeekItem) => void;
  onDone: (item: WeekItem) => void;
  onRemove: (item: WeekItem) => void;
}) {
  const total = week.items.length;
  return (
    <>
      <p className={styles.range}>
        {formatDayLabel(week.startsOn)} – {formatDayLabel(week.endsOn)}
      </p>
      {total === 0 ? <p className={styles.empty}>Your week is clear.</p> : null}
      <ol className={styles.days}>
        {week.days.map((day) => {
          const items = week.items.filter((item) => item.day === day);
          return (
            <li key={day} className={styles.day}>
              <h2 className={styles.dayHead}>
                <span>{formatDayLabel(day)}</span>
                <span className={styles.count}>{items.length === 0 ? "Clear" : String(items.length)}</span>
              </h2>
              {items.length > 0 ? (
                <ul className={styles.items}>
                  {items.map((item) => (
                    <li key={item.id} className={item.state === "done" ? `${styles.item} ${styles.done}` : styles.item}>
                      <p className={styles.itemTitle}>{item.title}</p>
                      <p className={styles.metaLine}>
                        {WEEK_SHAPE_LABELS[item.type]}
                        {item.time ? ` · ${formatClock(item.time)}` : ""} · {item.state === "done" ? "Done" : "Planned"}
                        {item.tataDestination ? ` · Demo · ${labelFor(item.tataDestination)}` : ""}
                      </p>
                      <div className={styles.rowActions}>
                        <Button variant="secondary" onClick={() => onEdit(item)} aria-pressed={editingId === item.id}>
                          Edit
                        </Button>
                        <Button variant="secondary" onClick={() => onDone(item)}>
                          {item.state === "done" ? "Mark planned" : "Mark done"}
                        </Button>
                        <Button variant="danger" onClick={() => onRemove(item)}>
                          Remove
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ol>
    </>
  );
}

function labelFor(destination: TataDestination): string {
  return listCatalogue().find((entry) => entry.destination === destination)?.label ?? destination;
}
