import type { ComponentPropsWithoutRef } from "react";
import styles from "./ActionGroup.module.css";

type ActionGroupProps = ComponentPropsWithoutRef<"fieldset"> & {
  legend?: string;
};

export function ActionGroup({ children, legend, className, ...props }: ActionGroupProps) {
  return (
    <fieldset className={[styles.actionGroup, className].filter(Boolean).join(" ")} {...props}>
      {legend && <legend className={styles.legend}>{legend}</legend>}
      {children}
    </fieldset>
  );
}
