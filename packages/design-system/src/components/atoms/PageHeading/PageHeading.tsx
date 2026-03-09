import type { ComponentPropsWithoutRef } from "react";
import styles from "./PageHeading.module.css";

type PageHeadingProps = ComponentPropsWithoutRef<"h2">;

export function PageHeading({ children, className, ...props }: PageHeadingProps) {
  const classes = [styles.heading, className].filter(Boolean).join(" ");
  return (
    <h2 className={classes} {...props}>
      {children}
    </h2>
  );
}
