"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { HYPOTHESIS_LINE, LIVING_LABELS, WEEK_SHAPE_LABELS } from "@/lib/labels";
import { readCachedUser, writeCachedUser } from "@/lib/local-user";
import { track } from "@/lib/track";
import type { User } from "@/lib/types";
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
          router.replace("/neuplan/onboarding");
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

  const living = user.livingSituation ? LIVING_LABELS[user.livingSituation] : "Not set";
  const shapes = user.weekShapes.map((shape) => WEEK_SHAPE_LABELS[shape]).join(", ");

  return (
    <main className={styles.page}>
      <p className={styles.banner}>DEMO DATA</p>
      <h1 className={styles.title}>NeuPlan</h1>
      <p className={styles.descriptor}>Your week. Planned around what matters.</p>
      <p className={styles.hypothesis}>{HYPOTHESIS_LINE} Not measured. Not achieved.</p>
      <p className={styles.meta}>
        {user.displayName} · {living}. This week includes {shapes || "nothing selected"}.
      </p>
      <Link className={styles.home} href="/">
        Home
      </Link>
    </main>
  );
}
