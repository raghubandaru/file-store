import clsx from "clsx";
import type { ComponentPropsWithoutRef, ElementType } from "react";
import styles from "./Button.module.css";

type ButtonProps<T extends ElementType = "button"> = {
  as?: T;
  variant?: "brand" | "primary" | "secondary";
  className?: string;
} & ComponentPropsWithoutRef<T>;

export function Button<T extends ElementType = "button">({
  as: Component = "button" as T,
  variant,
  className,
  children,
  ...props
}: ButtonProps<T>) {
  const Tag = Component as ElementType;
  return (
    <Tag className={clsx(styles.button, className)} data-variant={variant} {...props}>
      {children}
    </Tag>
  );
}
