"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { writeCachedUser } from "@/lib/local-user";
import { track } from "@/lib/track";
import type { Moment, Need, User } from "@/lib/types";
import { CommandCenter } from "./CommandCenter";
import { IntentScreen } from "./IntentScreen";
import styles from "./NeuPlanGate.module.css";

export function NeuPlanGate() {
  const [user, setUser] = useState<User | null>(null);
  const [empty, setEmpty] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [userResponse, momentResponse, needsResponse] = await Promise.all([
          fetch("/api/user"),
          fetch("/api/moments"),
          fetch("/api/needs"),
        ]);
        const userBody = (await userResponse.json()) as { user?: User };
        const momentBody = (await momentResponse.json()) as { moments?: Moment[] };
        const needsBody = (await needsResponse.json()) as { needs?: Need[] };
        if (!userResponse.ok || !userBody.user || !momentResponse.ok || !needsResponse.ok) {
          throw new Error("open");
        }
        if (cancelled) return;
        writeCachedUser(userBody.user);
        setUser(userBody.user);
        setEmpty((momentBody.moments ?? []).length === 0 && (needsBody.needs ?? []).length === 0);
        setError(false);
        await track("neuplan_open", { source: "entry" });
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

  if (loading && !user) {
    return (
      <main className={styles.page}>
        <h1 className={styles.title}>NeuPlan</h1>
        <Skeleton label="Opening NeuPlan" />
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className={styles.page}>
        <h1 className={styles.title}>NeuPlan</h1>
        <p className={styles.error} role="alert">
          We could not open NeuPlan.
        </p>
        <Button onClick={() => window.location.reload()}>Try again</Button>
      </main>
    );
  }

  if (empty) {
    return (
      <IntentScreen
        onCreated={() => {
          setEmpty(false);
        }}
      />
    );
  }

  return <CommandCenter user={user} />;
}
