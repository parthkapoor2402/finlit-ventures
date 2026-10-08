import { IconScan } from "./icons";
import styles from "./ScanScreen.module.css";

export function ScanScreen() {
  return (
    <main className={styles.page}>
      <div className={styles.circle} aria-hidden="true">
        <IconScan width={36} height={36} />
      </div>
      <h1 className={styles.title}>Scan & Pay</h1>
      <p className={styles.body}>Scan & Pay is not connected. Nothing here can send money.</p>
    </main>
  );
}
