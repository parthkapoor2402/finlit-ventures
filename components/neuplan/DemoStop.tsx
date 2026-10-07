"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { CatalogueEntry } from "@/lib/catalogue";
import { track } from "@/lib/track";
import styles from "./WeekScreen.module.css";

export function DemoStop({ entry }: { entry: CatalogueEntry }) {
  useEffect(() => {
    void track("tata_resolution_viewed", { destination: entry.destination });
  }, [entry.destination]);

  return (
    <main className={styles.page}>
      <p className={styles.banner}>DEMO DATA</p>
      <h1 className={styles.title}>{entry.label}</h1>
      <p className={styles.descriptor}>{entry.note}</p>
      <p className={styles.meta}>Demo only. isLive is false. Nothing here is for sale, in stock, or bookable.</p>
      <Link className={styles.home} href="/neuplan/needs">
        Back to needs
      </Link>
    </main>
  );
}
