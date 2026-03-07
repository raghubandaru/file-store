"use client";

import { useState } from "react";
import { Button, FileDropzone } from "@file-store/design-system";
import styles from "./page.module.css";

export default function UploadPage() {
  const [preview, setPreview] = useState<string | null>(null);

  function handleFileSelect(file: File) {
    const reader = new FileReader();
    reader.addEventListener("load", () => setPreview(reader.result as string), false);
    reader.readAsDataURL(file);
  }

  function handleClear() {
    setPreview(null);
  }

  return (
    <div className={styles.uploadContainer}>
      <FileDropzone preview={preview} onFileSelect={handleFileSelect} />
      {preview && (
        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={handleClear}>
            Clear
          </Button>
          <Button type="button" variant="primary">
            Upload
          </Button>
        </div>
      )}
    </div>
  );
}
