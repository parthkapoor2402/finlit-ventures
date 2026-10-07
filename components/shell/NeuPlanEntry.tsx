import styles from "./NeuPlanEntry.module.css";

export function NeuPlanEntry({ variant = "card" }: { variant?: "card" | "row" }) {
  return (
    <a className={variant === "card" ? styles.card : styles.row} href="/neuplan">
      <span className={styles.copy}>
        <span className={styles.name}>NeuPlan</span>
        <span className={styles.descriptor}>Your week. Planned around what matters.</span>
      </span>
      <span className={styles.open}>Open</span>
    </a>
  );
}
