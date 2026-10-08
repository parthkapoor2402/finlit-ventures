"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { QUICK_ACTIONS } from "@/lib/shell-content";
import { NeuPlanEntry } from "./NeuPlanEntry";
import { OpenNeeds } from "./OpenNeeds";
import { IconBill, IconPerson, IconPhone, IconRupee, IconSearch, IconSend, IconTag } from "./icons";
import styles from "./HomeScreen.module.css";

const ACTION_ICONS = {
  "send-money": IconSend,
  recharges: IconPhone,
  "pay-bills": IconBill,
  transactions: IconRupee,
} as const;

export function HomeScreen() {
  const [queryNotice, setQueryNotice] = useState(false);
  const [blocked, setBlocked] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <main className={styles.page}>
      <h1 className="sr-only">Home</h1>
      <div className={styles.top}>
        <form
          className={styles.search}
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            setQueryNotice(true);
          }}
        >
          <IconSearch />
          <label className="sr-only" htmlFor="home-search">
            Search
          </label>
          <input id="home-search" name="q" placeholder="Search" autoComplete="off" />
        </form>
        <button type="button" className={styles.profile} aria-label="Profile" onClick={() => setProfileOpen(true)}>
          <IconPerson />
        </button>
      </div>
      {queryNotice ? (
        <p className={styles.notice} role="status">
          Search is not connected in this prototype.
        </p>
      ) : null}

      <ul className={styles.quick}>
        {QUICK_ACTIONS.map((action) => {
          const Icon = ACTION_ICONS[action.id];
          return (
            <li key={action.id}>
              <button type="button" onClick={() => setBlocked(action.label)}>
                <span className={styles.tile}>
                  <Icon />
                </span>
                <span>{action.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className={styles.bento}>
        <button type="button" className={styles.cell} onClick={() => setBlocked("NeuPass")}>
          <p className={styles.eyebrow}>NEUPASS</p>
          <strong>Free Loyalty program</strong>
          <span className={styles.mark} aria-hidden="true">
            N
          </span>
        </button>
        <a className={styles.cell} href="/neucard">
          <p className={styles.eyebrow}>CARDS</p>
          <strong>Earn up to 10% with NeuCard</strong>
          <p className={styles.muted}>Issued by SBI Card and HDFC Bank</p>
        </a>
        <button type="button" className={`${styles.cell} ${styles.finance}`} onClick={() => setBlocked("Finance")}>
          <span>
            <strong>Finance</strong>
            <p className={styles.muted}>Loans, Insurance, Investments & more</p>
          </span>
        </button>
        <a className={styles.cell} href="/categories">
          <strong>Electronics</strong>
          <p className={styles.muted}>Mobile, TVs & more</p>
          <span className={styles.delivery}>3 hour delivery</span>
          <span className={styles.brand}>CROMA</span>
        </a>
        <a className={styles.cell} href="/categories">
          <strong>Hotels</strong>
          <p className={styles.muted}>Taj, Ginger and 8 other IHCL brands</p>
          <span className={styles.brand}>IHCL</span>
        </a>
      </div>

      <NeuPlanEntry />
      <OpenNeeds />

      <h2 className={styles.offersHead}>
        <span className={styles.badge}>
          <IconTag />
        </span>
        TOP OFFERS
      </h2>
      <a className={styles.offer} href="/offers">
        <strong>iPhone 17 Pro and iPhone 17 Pro Max</strong>
        <span>Prices Like Never Before</span>
      </a>

      <Dialog open={blocked !== null} title={blocked ?? "Not connected"} onClose={() => setBlocked(null)}>
        <p>This is not connected in this prototype. No money will be sent.</p>
      </Dialog>
      <Dialog open={profileOpen} title="Ananya" onClose={() => setProfileOpen(false)}>
        <div className={styles.sheet}>
          <p className={styles.demo}>DEMO DATA</p>
          <p>Ananya is an illustration for this prototype. No college, roommates, spend, or city is stored.</p>
          <p>Payments, offers, and cards on this shell are not live.</p>
        </div>
      </Dialog>
    </main>
  );
}
