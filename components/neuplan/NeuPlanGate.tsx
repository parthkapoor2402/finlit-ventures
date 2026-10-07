"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { readCachedUser, writeCachedUser } from "@/lib/local-user";
import { track } from "@/lib/track";
import type { User } from "@/lib/types";
import { CommandCenter } from "./CommandCenter";
import styles from "./NeuPlanGate.module.css";

export function NeuPlanGate() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch("/api/user");
        const body = (await response.json()) as { user?: User };
        if (!response.ok || !body.user) throw new Error("user");
        if (cancelled) return;
        writeCachedUser(body.user);
        if (!body.user.onboardingComplete) {
          router.replace("/neuplan/intro");
          return;
        }
        setUser(body.user);
        setError(false);
        await track("neuplan_open", { source: "entry" });
        await track("week_view_open", { source: "entry" });
      } catch {
        const cached = readCachedUser();
        if (!cancelled && cached?.onboardingComplete) {
          setUser(cached);
          setError(false);
        } else if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (loading && !user) {
    return (
      <main className={styles.page}>
        <h1 className={styles.title}>NeuPlan</h1>
        <Skeleton label="Opening NeuPlan" />
      </main>
    );
  }

  if (error && !user) {
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

  if (!user) return null;

  return <CommandCenter user={user} />;
}
