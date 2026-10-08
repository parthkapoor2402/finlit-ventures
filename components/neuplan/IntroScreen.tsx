"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Glyph } from "@/components/ui/Glyph";
import { track } from "@/lib/track";
import styles from "./Plan.module.css";

export function IntroScreen() {
  useEffect(() => {
    void track("neuplan_intro_viewed", { source: "intro" });
  }, []);

  return (
    <main className={styles.page}>
      <p className={styles.kicker}>NEUPLAN</p>
      <h1 className={styles.title}>Stay on top of what matters this week.</h1>
      <p className={styles.lead}>
        Keep track of the things you need to do, remember and take care of this week.
      </p>
      <ul className={styles.points}>
        <li>
          <span className={styles.icon}>
            <Glyph name="plan" />
          </span>
          <p>
            <strong>Plan</strong>
            <span>Know what matters this week.</span>
          </p>
        </li>
        <li>
          <span className={styles.icon}>
            <Glyph name="bell" />
          </span>
          <p>
            <strong>Stay on top</strong>
            <span>Keep important needs from slipping.</span>
          </p>
        </li>
        <li>
          <span className={styles.icon}>
            <Glyph name="arrow" />
          </span>
          <p>
            <strong>Get it done</strong>
            <span>When Tata Neu can help, go straight to it.</span>
          </p>
        </li>
      </ul>
      <div className={styles.actions}>
        <Link className={styles.primaryLink} href="/neuplan/onboarding">
          Build my week
        </Link>
        <Link href="/neuplan/example">See an example</Link>
      </div>
    </main>
  );
}
