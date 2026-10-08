"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { resolveNeed } from "@/lib/tata/resolutionEngine";
import type { Need } from "@/lib/types";
import styles from "./HomeScreen.module.css";

export function OpenNeeds() {
  const [needs, setNeeds] = useState<Need[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch("/api/needs");
        const body = (await response.json()) as { needs?: Need[] };
        if (!response.ok || !body.needs || cancelled) return;
        setNeeds(body.needs.filter((need) => need.state !== "resolved").slice(0, 3));
      } catch {
        if (!cancelled) setNeeds([]);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (needs.length === 0) return null;

  return (
    <section className={styles.offersHead} aria-labelledby="open-needs">
      <h2 id="open-needs">
        {needs.length} still to take care of
      </h2>
      <ul>
        {needs.map((need) => {
          const resolution = resolveNeed(need.type, need.title);
          return (
            <li key={need.id}>
              <Link href={`/neuplan/needs/${need.id}`}>
                ○ {need.title}
                {resolution ? ` → ${resolution.label}` : ""}
              </Link>
            </li>
          );
        })}
      </ul>
      <p>
        <Link href="/neuplan/needs">View Needs</Link>
      </p>
    </section>
  );
}
