import type { ReactNode } from "react";
import styles from "./Main.module.css";

type MainProps = {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
};

export function Main({ title, subtitle, children }: MainProps) {
  return (
    <main id="main-content" className={styles.wrapperBody}>
      <div className={styles.container}>
        {(title || subtitle) && (
          <div className={styles.pageHeader}>
            {title && <h1>{title}</h1>}
            {subtitle && <p>{subtitle}</p>}
          </div>
        )}
        <div className={styles.card}>{children}</div>
      </div>
    </main>
  );
}
