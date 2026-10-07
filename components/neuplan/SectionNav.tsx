import Link from "next/link";
import styles from "./SectionNav.module.css";

const LINKS = [
  { href: "/neuplan", id: "now", label: "Now" },
  { href: "/neuplan/needs", id: "needs", label: "Needs" },
  { href: "/neuplan/activity", id: "activity", label: "Activity" },
  { href: "/neuplan/summary", id: "summary", label: "Summary" },
] as const;

export function SectionNav({ current }: { current: (typeof LINKS)[number]["id"] }) {
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
