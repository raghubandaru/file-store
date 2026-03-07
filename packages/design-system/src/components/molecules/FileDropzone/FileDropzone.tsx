"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePreview } from "../ImagePreview";
import styles from "./FileDropzone.module.css";

type FileDropzoneProps = {
  preview: string | null;
  onFileSelect: (file: File) => void;
  accept?: string;
};

export function FileDropzone({ preview, onFileSelect, accept = "image/*" }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    if (!preview && inputRef.current) {
      inputRef.current.value = "";
    }
  }, [preview]);

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave() {
    setIsDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  }

  return (
    <label
      aria-label="Upload file: drag and drop or click to browse"
      className={styles.dropzone}
      data-drag-over={isDragOver}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className={styles.hiddenInput}
        onChange={handleInputChange}
      />
      {preview ? (
        <ImagePreview src={preview} alt="Upload preview" className={styles.preview} />
      ) : (
        <p aria-live="polite">{isDragOver ? "Drop the image here" : "Upload Image"}</p>
      )}
    </label>
  );
}
