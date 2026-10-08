import Link from "next/link";
import styles from "./SectionNav.module.css";

const LINKS = [
  { href: "/neuplan", id: "now", label: "On Track" },
  { href: "/neuplan/needs", id: "needs", label: "Needs" },
] as const;

export function SectionNav({ current }: { current: "now" | "needs" | "activity" | "summary" }) {
  return (
    <nav className={styles.nav} aria-label="NeuPlan">
      {LINKS.map((link) => (
        <Link key={link.id} href={link.href} aria-current={link.id === current ? "page" : undefined}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
