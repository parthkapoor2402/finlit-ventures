"use client";

import { Glyph } from "@/components/ui/Glyph";
import { track } from "@/lib/track";
import styles from "./NeuPlanEntry.module.css";

export function NeuPlanEntry({ variant = "card", source = "home" }: { variant?: "card" | "row"; source?: string }) {
  return (
    <a
      className={variant === "card" ? styles.card : styles.row}
      href="/neuplan"
      onClick={() => {
        void track("neuplan_discovered", { source });
      }}
    >
      <span className={styles.mark} aria-hidden="true">
        <Glyph name="plan" />
      </span>
      <span className={styles.copy}>
        <span className={styles.kicker}>
          <span className={styles.name}>NeuPlan</span>
          {variant === "card" ? <span className={styles.badge}>New</span> : null}
        </span>
        <span className={styles.headline}>Your week. Planned around what matters.</span>
        {variant === "card" ? (
          <span className={styles.body}>Stay on top of plans, needs and things you do not want to forget.</span>
        ) : null}
        <span className={styles.open}>Open NeuPlan</span>
      </span>
    </a>
  );
}
