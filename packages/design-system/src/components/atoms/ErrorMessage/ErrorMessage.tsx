import type { ComponentPropsWithoutRef } from "react";
import styles from "./ErrorMessage.module.css";

type ErrorMessageProps = ComponentPropsWithoutRef<"p">;

export function ErrorMessage({ children, className, ...props }: ErrorMessageProps) {
  return (
    <p
      role="alert"
      className={[styles.errorMessage, className].filter(Boolean).join(" ")}
      {...props}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
        className={styles.icon}
      >
        <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 3.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4.5zm0 6.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z" />
      </svg>
      {children}
    </p>
  );
}
