"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, ErrorMessage, FileDropzone, PageHeading } from "@file-store/design-system";
import { MAX_FILE_SIZE, ALLOWED_CONTENT_TYPES } from "@file-store/schemas/upload";
import styles from "./upload-form.module.css";

type Status = "idle" | "preview" | "uploading";

export function UploadForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  function handleFileSelect(f: File) {
    if (!ALLOWED_CONTENT_TYPES.includes(f.type as (typeof ALLOWED_CONTENT_TYPES)[number])) {
      setError("Only JPEG and PNG files are allowed.");
      return;
    }
    if (f.size > MAX_FILE_SIZE) {
      setError("File size must be 5 MB or less.");
      return;
    }
    setError(null);
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
    setStatus("preview");
  }

  function handleClear() {
    setFile(null);
    setPreview(null);
    setStatus("idle");
    setError(null);
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!file) return;
    setStatus("uploading");

    const res = await fetch("/api/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type,
        size: file.size,
      }),
    });

    if (!res.ok) {
      const { error: msg } = await res.json();
      setError(msg ?? "Upload failed.");
      setStatus("preview");
      return;
    }

    const { uploadUrl, fileUrl, key } = await res.json();

    const s3Res = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!s3Res.ok) {
      setError("Upload to storage failed. Please try again.");
      setStatus("preview");
      return;
    }

    await fetch("/api/save-file", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key,
        fileUrl,
        filename: file.name,
        contentType: file.type,
        size: file.size,
      }),
    });

    router.push("/file/list");
  }

  if (status === "uploading") {
    return (
      <div className={styles.container}>
        <div role="status" aria-live="polite" className={styles.uploading}>
          <p>Uploading…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeading>Upload</PageHeading>
      <form className={styles.container} onSubmit={handleSubmit}>
        <FileDropzone
          preview={preview}
          onFileSelect={handleFileSelect}
          accept={ALLOWED_CONTENT_TYPES.join(",")}
          hint={[
            `Accepted formats: ${ALLOWED_CONTENT_TYPES.map((t) => t.split("/")[1].toUpperCase()).join(", ")}`,
            `Max size: ${MAX_FILE_SIZE / (1024 * 1024)} MB`,
          ]}
        />

        {error && <ErrorMessage className={styles.error}>{error}</ErrorMessage>}

        {file && (
          <div className={styles.meta}>
            <span className={styles.filename}>{file.name}</span>
            <span className={styles.size}>{(file.size / 1024).toFixed(1)} KB</span>
          </div>
        )}

        {file && (
          <div className={styles.actions}>
            <Button type="submit" variant="primary">
              Upload
            </Button>
            <Button type="button" variant="secondary" onClick={handleClear}>
              Clear
            </Button>
          </div>
        )}
      </form>
    </>
  );
}
