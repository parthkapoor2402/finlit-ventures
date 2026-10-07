"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { CATEGORY_GROUPS } from "@/lib/shell-content";
import { NeuPlanEntry } from "./NeuPlanEntry";
import { IconCard } from "./icons";
import styles from "./CategoriesScreen.module.css";

export function CategoriesScreen() {
  const [blocked, setBlocked] = useState<string | null>(null);

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Categories</h1>
      {CATEGORY_GROUPS.map((group) => (
        <section key={group.id} className={styles.group} aria-labelledby={group.id}>
          <h2 id={group.id}>{group.title}</h2>
          <ul className={styles.grid}>
            {group.items.map((item) => (
              <li key={item}>
                <button type="button" onClick={() => setBlocked(item)}>
                  <span className={styles.circle}>
                    <IconCard />
                  </span>
                  <span>{item}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <NeuPlanEntry variant="row" />
      <Dialog open={blocked !== null} title={blocked ?? "Category"} onClose={() => setBlocked(null)}>
        <p>This category is not connected in this prototype.</p>
      </Dialog>
    </main>
  );
}
