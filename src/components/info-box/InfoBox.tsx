import styles from "./InfoBox.module.css";

interface InfoBoxProps {
  label1: string;
  value1: string | number;
  label2: string;
  value2: string | number;
}

export default function InfoBox({ label1, value1, label2, value2 }: InfoBoxProps) {
  return (
    <div className={styles.infoBox}>
      <div className={styles.infoPair}>
        <span className={styles.label}>{label1}</span>
        <span className={styles.value}>{value1}</span>
      </div>
      <div className={styles.infoPair}>
        <span className={styles.label}>{label2}</span>
        <span className={styles.value}>{value2}</span>
      </div>
    </div>
  );
}
