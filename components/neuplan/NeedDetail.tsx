"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { catalogueEntry } from "@/lib/catalogue";
import { NEED_TYPE_LABELS, formatDayLabel } from "@/lib/labels";
import { resolutionReason, suggestResolution } from "@/lib/resolve";
import { markMeaningfulSession, track } from "@/lib/track";
import type { Need } from "@/lib/types";
import styles from "./Plan.module.css";

export function NeedDetail({ id }: { id: string }) {
  const router = useRouter();
  const [need, setNeed] = useState<Need | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch("/api/needs");
        const body = (await response.json()) as { needs?: Need[] };
        const found = body.needs?.find((entry) => entry.id === id) ?? null;
        if (!response.ok || !found) throw new Error("missing");
        if (cancelled) return;
        setNeed(found);
        await track("need_viewed", { type: found.type });
        const destination = suggestResolution(found.type, found.title);
        if (destination && found.state === "open") {
          await track("tata_resolution_shown", { destination, type: found.type });
        }
      } catch {
        if (!cancelled) setError("We could not open that need.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function explore() {
    if (!need) return;
    const destination = suggestResolution(need.type, need.title);
    if (!destination) return;
    const response = await fetch(`/api/needs/${need.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ state: "exploring", tataDestination: destination }),
    });
    if (!response.ok) {
      setError("That Tata stop does not fit this need.");
      return;
    }
    await track("commerce_intent", { destination, type: need.type });
    await track("tata_resolution_clicked", { destination, type: need.type });
    await markMeaningfulSession();
    router.push(`/neuplan/demo/${destination}?need=${need.id}`);
  }

  async function finish() {
    if (!need) return;
    const response = await fetch(`/api/needs/${need.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ state: "resolved", tataDestination: null }),
    });
    if (!response.ok) {
      setError("We could not update that need.");
      return;
    }
    await track("need_resolved", { type: need.type, destination: "none" });
    await markMeaningfulSession();
    router.push("/neuplan");
  }

  if (loading) {
    return (
      <main className={styles.page}>
        <h1 className={styles.title}>Need</h1>
        <Skeleton label="Opening this need" />
      </main>
    );
  }

  if (!need) {
    return (
      <main className={styles.page}>
        <h1 className={styles.title}>Need</h1>
        <p className={styles.error} role="alert">
          {error || "We could not open that need."}
        </p>
        <Link href="/neuplan">Back to NeuPlan</Link>
      </main>
    );
  }

  const destination = suggestResolution(need.type, need.title);
  const status = need.state === "exploring" ? "Exploring" : need.state === "resolved" ? "Done" : "Still open";

  return (
    <main className={styles.page}>
      <p className={styles.demo}>DEMO DATA</p>
      <h1 className={styles.title}>{need.title}</h1>
      <p className={styles.lead}>
        {NEED_TYPE_LABELS[need.type]} · {status}
        {need.day ? ` · ${formatDayLabel(need.day)}` : ""}
      </p>
      {need.state !== "resolved" && destination ? (
        <section className={styles.section}>
          <h2>GET IT DONE</h2>
          <p className={styles.lead}>
            {catalogueEntry(destination).label} may help with this. {resolutionReason(destination)}.
          </p>
          <p className={styles.meta}>Demo catalogue. Not live availability.</p>
          <div className={styles.actions}>
            <button type="button" className={styles.primaryLink} onClick={() => void explore()}>
              Explore on Tata Neu
            </button>
          </div>
        </section>
      ) : (
        <p className={styles.lead}>This stays on your list. Tata Neu does not need to sell you anything for it.</p>
      )}
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
      {need.state !== "resolved" ? (
        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => void finish()}>
            I will handle this myself
          </Button>
        </div>
      ) : null}
      {need.state === "exploring" && need.resolution ? (
        <p className={styles.meta}>
          <Link href={`/neuplan/demo/${need.resolution.destination}?need=${need.id}`}>
            Continue on {need.resolution.label}
          </Link>
        </p>
      ) : null}
      <p className={styles.meta}>
        <Link href="/neuplan">Back to NeuPlan</Link>
      </p>
    </main>
  );
}
