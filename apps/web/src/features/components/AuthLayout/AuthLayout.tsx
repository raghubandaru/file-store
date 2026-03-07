import styles from "./AuthLayout.module.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>{children}</div>
    </div>
  );
}
