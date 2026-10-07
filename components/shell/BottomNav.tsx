"use client";

import { usePathname } from "next/navigation";
import { IconCard, IconCategories, IconHome, IconScan, IconTag } from "./icons";
import styles from "./BottomNav.module.css";

const ITEMS = [
  { href: "/", label: "Home", icon: IconHome },
  { href: "/categories", label: "Categories", icon: IconCategories },
  { href: "/scan", label: "Scan & Pay", icon: IconScan, scan: true },
  { href: "/offers", label: "Offers", icon: IconTag },
  { href: "/neucard", label: "NeuCard", icon: IconCard },
] as const;

function isCurrent(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomNav() {
  const pathname = usePathname();
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
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
