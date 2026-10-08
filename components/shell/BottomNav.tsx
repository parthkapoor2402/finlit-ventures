"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { IconCard, IconCategories, IconHome, IconNeeds, IconScan } from "./icons";
import styles from "./BottomNav.module.css";

const ITEMS = [
  { href: "/", label: "Home", icon: IconHome },
  { href: "/categories", label: "Categories", icon: IconCategories },
  { href: "/scan", label: "Scan & Pay", icon: IconScan, scan: true },
  { href: "/neuplan/needs", label: "Needs", icon: IconNeeds, count: true },
  { href: "/neucard", label: "NeuCard", icon: IconCard },
] as const;

function isCurrent(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomNav() {
  const pathname = usePathname();
  const [openCount, setOpenCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch("/api/needs");
        const body = (await response.json()) as { needs?: { state: string }[] };
        if (!response.ok || !body.needs || cancelled) return;
        setOpenCount(body.needs.filter((need) => need.state !== "resolved").length);
      } catch {
        if (!cancelled) setOpenCount(0);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return (
    <nav className={styles.nav} aria-label="Primary">
      {ITEMS.map((item) => {
        const Icon = item.icon;
        const current = isCurrent(pathname, item.href);
        const scan = "scan" in item && item.scan;
        return (
          <a
            key={item.href}
            href={item.href}
            className={scan ? `${styles.item} ${styles.scan}` : styles.item}
            aria-current={current ? "page" : undefined}
          >
            {scan ? (
              <span className={styles.circle}>
                <Icon />
              </span>
            ) : (
              <Icon />
            )}
            {"count" in item && item.count && openCount > 0 ? `Needs ${openCount}` : item.label}
          </a>
        );
      })}
    </nav>
  );
}
