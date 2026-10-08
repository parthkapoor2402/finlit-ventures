import Link from "next/link";
import styles from "./Plan.module.css";

const ROWS = [
  { day: "MON", lines: ["Classes · 10:00 AM", "Assignment due · 6:00 PM"] },
  { day: "WED", lines: ["Replace charger"] },
  { day: "FRI", lines: ["Travel home"] },
  { day: "SAT", lines: ["Birthday gift"] },
];

export function ExampleScreen() {
  return (
    <main className={styles.page}>
      <p className={styles.demo}>EXAMPLE · NOT YOUR WEEK</p>
      <h1 className={styles.title}>This week</h1>
      <p className={styles.lead}>NeuPlan brings the things that matter together so you know what needs attention.</p>
      <ol className={styles.example}>
        {ROWS.map((row) => (
          <li key={row.day}>
            <span className={styles.day}>{row.day}</span>
            <div>
              {row.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </li>
        ))}
      </ol>
      <p className={styles.meta}>A charger can go to Croma. An assignment stays a task. Nothing here is live.</p>
      <div className={styles.actions}>
        <Link className={styles.primaryLink} href="/neuplan/onboarding">
          Set up my week
        </Link>
      </div>
    </main>
  );
}
