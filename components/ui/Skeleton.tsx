import styles from "./Skeleton.module.css";

export function Skeleton({ label }: { label: string }) {
  return (
    <div className={styles.block} role="status" aria-busy="true" aria-label={label}>
      <span className={`${styles.bar} ${styles.barShort}`} />
      <span className={`${styles.bar} ${styles.barLong}`} />
      <span className={`${styles.bar} ${styles.barLong}`} />
    </div>
  );
}
