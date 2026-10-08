"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { NEED_TYPE_LABELS, formatDayLabel } from "@/lib/labels";
import { resolutionReason } from "@/lib/resolve";
import { resolveNeed } from "@/lib/tata/resolutionEngine";
import { markMeaningfulSession, track } from "@/lib/track";
import type { Moment, Need } from "@/lib/types";
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
        const resolution = resolveNeed(found.type, found.title);
        if (resolution && found.state === "open") {
          await track("tata_resolution_shown", { destination: resolution.destination, type: found.type });
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
    const resolution = resolveNeed(need.type, need.title);
    if (!resolution) return;
    const response = await fetch(`/api/needs/${need.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ state: "exploring", tataDestination: resolution.destination }),
    });
    if (!response.ok) {
      setError("That Tata stop does not fit this need.");
      return;
    }
    await track("commerce_intent", { destination: resolution.destination, type: need.type });
    await track("commerce_action", { destination: resolution.destination, type: need.type });
    await track("tata_resolution_clicked", { destination: resolution.destination, type: need.type });
    if (need.momentId) await track("moment_updated", { type: need.type, state: "exploring" });
    await markMeaningfulSession();
    router.push(`/neuplan/demo/${resolution.destination}?need=${need.id}`);
  }

  async function finish() {
    if (!need) return;
    const response = await fetch(`/api/needs/${need.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ state: "resolved", tataDestination: null }),
    });
    const body = (await response.json()) as { moment?: Moment | null };
    if (!response.ok) {
      setError("We could not update that need.");
      return;
    }
    await track("need_resolved", { type: need.type, destination: "none" });
    if (body.moment?.status === "done") {
      await track("moment_resolved", { type: body.moment.kind });
    }
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

  const resolution = resolveNeed(need.type, need.title);
  const status =
    need.state === "exploring"
      ? "EXPLORING"
      : need.state === "resolved"
        ? need.type === "book"
          ? "BOOKED · NEED FULFILLED"
          : "NEED FULFILLED"
        : "STILL OPEN";

  return (
    <main className={styles.page}>
      <p className={styles.demo}>DEMO DATA</p>
      <h1 className={styles.title}>{need.title}</h1>
      <p className={styles.lead}>
        {NEED_TYPE_LABELS[need.type]} · {status}
        {need.day ? ` · ${formatDayLabel(need.day)}` : ""}
      </p>
      {need.state === "resolved" ? (
        <p className={styles.lead}>Done.</p>
      ) : resolution ? (
        <section className={styles.section}>
          <h2>GET IT DONE</h2>
          <p className={styles.lead}>
            {resolution.label}. {resolutionReason(resolution.destination)}
          </p>
          <p className={styles.meta}>Demo catalogue. Price is ₹—. Not live availability.</p>
          <p className={styles.meta}>
            Demo NeuCoins. Not a live balance or a live earn rate. Eligible Tata Neu purchases can earn NeuCoins, and NeuCoins can be used at checkout. Where a brand is eligible, 1 NeuCoin is ₹1. Demo balance on this profile: 250 NeuCoins.
          </p>
          <div className={styles.actions}>
            <button type="button" className={styles.primaryLink} onClick={() => void explore()}>
              Explore on Tata Neu
            </button>
          </div>
        </section>
      ) : (
        <p className={styles.lead}>Tata Neu cannot finish this.</p>
      )}
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
      {need.state !== "resolved" ? (
        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => void finish()}>
            Mark done
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
