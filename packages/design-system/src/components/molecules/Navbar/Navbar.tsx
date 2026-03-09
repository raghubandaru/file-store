import type { ReactNode } from "react";
import styles from "./Navbar.module.css";

type NavbarProps = {
  children?: ReactNode;
};

export function Navbar({ children }: NavbarProps) {
  return (
    <header className={styles.header}>
      <nav aria-label="Main" className={styles.inner}>
        {children}
      </nav>
    </header>
  );
}
