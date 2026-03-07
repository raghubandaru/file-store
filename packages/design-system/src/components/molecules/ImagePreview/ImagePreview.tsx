import type { ComponentPropsWithoutRef } from "react";
import styles from "./ImagePreview.module.css";

type ImagePreviewProps = ComponentPropsWithoutRef<"img"> & {
  src: string;
  alt: string;
};

export function ImagePreview({ className, ...props }: ImagePreviewProps) {
  return <img className={[styles.image, className].filter(Boolean).join(" ")} {...props} />;
}
