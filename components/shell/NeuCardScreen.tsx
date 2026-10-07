"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { NEUCARD_BENEFITS, REFERENCE_NOTE } from "@/lib/shell-content";
import styles from "./NeuCardScreen.module.css";

const ISSUERS = ["HDFC Bank", "SBI Card"] as const;

export function NeuCardScreen() {
  const [issuer, setIssuer] = useState<string | null>(null);

  return (
    <main className={styles.page}>
      <p className={styles.presents}>Tata Neu presents</p>
      <h1 className={styles.title}>India’s most rewarding card</h1>
      <p className={styles.choose}>CHOOSE YOUR ISSUER</p>
      <div className={styles.issuers}>
        {ISSUERS.map((name) => (
          <section key={name} className={styles.issuer} aria-label={name}>
            <p>{name}</p>
            <div className={styles.plastic} aria-hidden="true">
              NeuCard
            </div>
            <button type="button" className={styles.apply} onClick={() => setIssuer(name)}>
              Apply
            </button>
          </section>
        ))}
      </div>
      <p className={styles.same}>Same Benefits. Two Trusted Issuers.</p>
      <dl className={styles.benefits}>
        {NEUCARD_BENEFITS.map((benefit) => (
          <div key={benefit.value}>
            <dt>{benefit.value}</dt>
            <dd>{benefit.label}</dd>
          </div>
        ))}
      </dl>
      <p className={styles.coin}>1 NEUCOIN = ₹1 SAVING</p>
      <p className={styles.note}>{REFERENCE_NOTE} Apply does not start an application.</p>
      <Dialog open={issuer !== null} title={issuer ? `Apply with ${issuer}` : "Apply"} onClose={() => setIssuer(null)}>
        <p>Card application is not connected in this prototype.</p>
      </Dialog>
    </main>
  );
}
