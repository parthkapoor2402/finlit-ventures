"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/Skeleton";
import { HYPOTHESIS_LINE, NEED_TYPE_LABELS } from "@/lib/labels";
import { suggestResolution } from "@/lib/resolve";
import { catalogueEntry } from "@/lib/catalogue";
import type { Need } from "@/lib/types";
import { SectionNav } from "./SectionNav";
import styles from "./Plan.module.css";

export function NeedsScreen() {
  const [needs, setNeeds] = useState<Need[] | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch("/api/needs");
        const body = (await response.json()) as { needs?: Need[] };
        if (!response.ok || !body.needs) throw new Error("needs");
        if (!cancelled) setNeeds(body.needs);
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
      <p className={styles.kicker}>NEUPLAN</p>
      <h1 className={styles.title}>Needs</h1>
      <p className={styles.lead}>Things you do not want to forget.</p>
      <p className={styles.hypothesis}>{HYPOTHESIS_LINE} Not measured. Not achieved.</p>
      <SectionNav current="needs" />
      {loading && !needs ? <Skeleton label="Loading needs" /> : null}
      {error ? (
        <p className={styles.error} role="alert">
          We could not load needs.
        </p>
      ) : null}
      {needs && needs.length === 0 ? (
        <p className={styles.empty}>
          Nothing is waiting on you. <Link href="/neuplan/needs/new">Add a need</Link>
        </p>
      ) : null}
      {needs ? (
        <ul className={styles.list}>
          {needs.map((need) => {
            const destination = suggestResolution(need.type, need.title);
            return (
              <li key={need.id}>
                <Link className={styles.rowLink} href={`/neuplan/needs/${need.id}`}>
                  <span>
                    <p className={styles.itemTitle}>{need.title}</p>
                    <p className={styles.metaLine}>
                      {NEED_TYPE_LABELS[need.type]} · {need.state === "open" ? "Still open" : need.state === "exploring" ? "Exploring" : "Done"}
                      {destination ? ` · ${catalogueEntry(destination).label}` : ""}
                    </p>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
      <div className={styles.actions}>
        <Link className={styles.primaryLink} href="/neuplan/needs/new">
          Add a need
        </Link>
      </div>
    </main>
  );
}
