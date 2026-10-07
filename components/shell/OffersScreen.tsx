"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { REFERENCE_NOTE } from "@/lib/shell-content";
import styles from "./OffersScreen.module.css";

export function OffersScreen() {
  const [blocked, setBlocked] = useState<string | null>(null);

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Offers</h1>
      <section className={styles.banner} aria-label="NeuCard Spotify">
        <p className={styles.kicker}>Spotify Premium Standard</p>
        <h2>FREE Spotify Premium Standard for 4 months with Neucard</h2>
        <p className={styles.fine}>Issued by SBI Card and HDFC Bank. T&C apply.</p>
      </section>

      <section className={styles.section}>
        <h2>Credit Card</h2>
        <div className={styles.panel}>
          <button type="button" className={styles.unlock} onClick={() => setBlocked("Exclusive offers")}>
            UNLOCK EXCLUSIVE OFFERS
          </button>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="electronics-zone">
        <h2 id="electronics-zone">Electronics Zone</h2>
        <div className={styles.split}>
          <button type="button" className={styles.product} onClick={() => setBlocked("Croma")}>
            <span className={styles.swatch} aria-hidden="true" />
            <strong>Bring home more with No Cost EMI</strong>
            <span>Inc all offers. Croma.</span>
          </button>
          <button type="button" className={styles.product} onClick={() => setBlocked("iPhone 17 Pro")}>
            <span className={styles.swatch} aria-hidden="true" />
            <strong>iPhone 17 Pro and iPhone 17 Pro Max</strong>
            <span>Prices Like Never Before</span>
          </button>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Travel Zone</h2>
        <div className={styles.travel}>
          <p>Taj, Ginger and 8 other IHCL brands</p>
        </div>
      </section>

      <p className={styles.note}>{REFERENCE_NOTE}</p>

      <Dialog open={blocked !== null} title={blocked ?? "Offer"} onClose={() => setBlocked(null)}>
        <p>This offer is not connected. Nothing will be unlocked or added to an order.</p>
      </Dialog>
    </main>
  );
}
