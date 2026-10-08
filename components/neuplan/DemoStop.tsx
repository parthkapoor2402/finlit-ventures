"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DEMO_PRODUCTS } from "@/lib/demo-products";
import type { CatalogueEntry } from "@/lib/catalogue";
import { track } from "@/lib/track";
import styles from "./Plan.module.css";

export function DemoStop({ entry, needId }: { entry: CatalogueEntry; needId?: string }) {
  const [opened, setOpened] = useState(false);
  const products = DEMO_PRODUCTS[entry.destination];

  useEffect(() => {
    void track("tata_resolution_viewed", { destination: entry.destination });
  }, [entry.destination]);

  return (
    <main className={styles.page}>
      <p className={styles.demo}>DEMO CATALOGUE</p>
      <h1 className={styles.title}>{entry.label}</h1>
      <p className={styles.lead}>{entry.note}</p>
      <p className={styles.meta}>Not live. Nothing here is for sale, in stock, or bookable.</p>
      <ul className={styles.list}>
        {products.map((product) => (
          <li key={product.name} className={styles.product}>
            <p className={styles.itemTitle}>{product.name}</p>
            <p>{product.detail}</p>
            <p className={styles.price}>
              Demo product · <span aria-label="Price not shown">₹—</span>
            </p>
          </li>
        ))}
      </ul>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.primaryLink}
          onClick={() => {
            setOpened(true);
            void track("commerce_demo_opened", { destination: entry.destination });
          }}
        >
          View on {entry.label}
        </button>
      </div>
      {opened ? (
        <p className={styles.lead} role="status">
          This would open {entry.label}. This prototype stays inside Tata Neu, and nothing here is for sale.
        </p>
      ) : null}
      <p className={styles.meta}>
        <Link href={needId ? `/neuplan/needs/${needId}` : "/neuplan"}>Back to NeuPlan</Link>
      </p>
    </main>
  );
}
