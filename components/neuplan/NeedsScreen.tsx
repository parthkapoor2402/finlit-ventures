"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { SelectField, TextField } from "@/components/ui/TextField";
import { Skeleton } from "@/components/ui/Skeleton";
import { NEED_DESTINATIONS, catalogueEntry } from "@/lib/catalogue";
import { HYPOTHESIS_LINE, NEED_TYPE_LABELS } from "@/lib/labels";
import { markMeaningfulSession, track } from "@/lib/track";
import { NEED_TYPES, type Need, type NeedType, type TataDestination } from "@/lib/types";
import { SectionNav } from "./SectionNav";
import styles from "./WeekScreen.module.css";

export function NeedsScreen() {
  const router = useRouter();
  const [needs, setNeeds] = useState<Need[] | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);
  const [type, setType] = useState<NeedType>("buy");
  const [title, setTitle] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch("/api/needs");
        const body = (await response.json()) as { needs?: Need[] };
        if (!response.ok || !body.needs) throw new Error("needs");
        if (cancelled) return;
        setNeeds(body.needs);
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

  async function add(event: FormEvent) {
    event.preventDefault();
    setFormError("");
    const response = await fetch("/api/needs", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type, title }),
    });
    const body = (await response.json()) as { message?: string };
    if (!response.ok) {
      setFormError(body.message ?? "We couldn't add that need.");
      return;
    }
    await track("need_created", { type });
    await markMeaningfulSession();
    setTitle("");
    refresh();
  }

  async function resolve(need: Need, destination: TataDestination | null) {
    const response = await fetch(`/api/needs/${need.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ state: "resolved", tataDestination: destination }),
    });
    if (!response.ok) {
      setFormError("That Tata stop does not fit this need.");
      return;
    }
    await track("need_resolved", { type: need.type, destination: destination ?? "none" });
    await markMeaningfulSession();
    if (destination) {
      await track("tata_resolution_clicked", { destination, type: need.type });
      router.push(`/neuplan/demo/${destination}`);
      return;
    }
    refresh();
  }

  return (
    <main className={styles.page}>
      <p className={styles.banner}>DEMO DATA</p>
      <h1 className={styles.title}>Needs</h1>
      <p className={styles.descriptor}>Hold something until you deal with it.</p>
      <p className={styles.hypothesis}>{HYPOTHESIS_LINE} Not measured. Not achieved.</p>
      <SectionNav current="needs" />
      {loading && !needs ? <Skeleton label="Loading needs" /> : null}
      {error ? (
        <div>
          <p className={styles.error} role="alert">
            We could not load needs.
          </p>
          <Button onClick={refresh}>Try again</Button>
        </div>
      ) : null}
      {needs && needs.length === 0 ? <p className={styles.empty}>No needs yet.</p> : null}
      {needs ? (
        <ul className={styles.items}>
          {needs.map((need) => (
            <li key={need.id} className={styles.item}>
              <p className={styles.itemTitle}>{need.title}</p>
              <p className={styles.metaLine}>
                {NEED_TYPE_LABELS[need.type]} · {need.state === "open" ? "Open" : "Resolved"}
                {need.resolution ? ` · Demo · ${need.resolution.label}` : ""}
              </p>
              {need.state === "open" ? (
                <div className={styles.rowActions}>
                  {NEED_DESTINATIONS[need.type].map((destination) => (
                    <Button key={destination} variant="secondary" onClick={() => void resolve(need, destination)}>
                      {catalogueEntry(destination).label}
                    </Button>
                  ))}
                  <Button variant="secondary" onClick={() => void resolve(need, null)}>
                    No Tata stop
                  </Button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
      <form className={styles.form} onSubmit={(event) => void add(event)}>
        <h2>Add a need</h2>
        <SelectField label="Type" value={type} onChange={(event) => setType(event.target.value as NeedType)}>
          {NEED_TYPES.map((entry) => (
            <option key={entry} value={entry}>
              {NEED_TYPE_LABELS[entry]}
            </option>
          ))}
        </SelectField>
        <TextField label="Need" value={title} onChange={(event) => setTitle(event.target.value)} />
        {formError ? (
          <p className={styles.error} role="alert">
            {formError}
          </p>
        ) : null}
        <Button type="submit">Add a need</Button>
      </form>
    </main>
  );
}
