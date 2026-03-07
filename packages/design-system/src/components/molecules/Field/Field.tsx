import type { ComponentPropsWithoutRef } from "react";
import styles from "./Field.module.css";

type FieldProps = ComponentPropsWithoutRef<"div">;

export function Field({ children, className, ...props }: FieldProps) {
  return (
    <div className={[styles.field, className].filter(Boolean).join(" ")} {...props}>
      {children}
    </div>
  );
}
