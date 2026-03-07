import type { LabelHTMLAttributes } from "react";
import styles from "./Label.module.css";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ children, ...props }: LabelProps) {
  return (
    <label className={styles.label} {...props}>
      {children}
    </label>
  );
}
