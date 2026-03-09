"use client";

import { useRef, useState } from "react";
import { Button } from "../../atoms/Button";
import { ErrorMessage } from "../../atoms/ErrorMessage";
import { ImagePreview } from "../../molecules/ImagePreview";
import styles from "./FileList.module.css";

export type FileItem = {
  id: string;
  filename: string;
  size: number;
  url: string;
  uploadedAt: string;
};

type FileListProps = {
  files: FileItem[];
  onDelete?: (id: string) => Promise<void>;
};

export function FileList({ files, onDelete }: FileListProps) {
  const [selected, setSelected] = useState<FileItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  function openModal(file: FileItem, trigger: HTMLButtonElement) {
    triggerRef.current = trigger;
    setSelected(file);
    setConfirmDelete(false);
    setDeleteError(null);
    requestAnimationFrame(() => dialogRef.current?.showModal());
  }

  function closeModal() {
    dialogRef.current?.close();
    setSelected(null);
    setConfirmDelete(false);
    setDeleteError(null);
    triggerRef.current?.focus();
    triggerRef.current = null;
  }

  async function handleDelete() {
    if (!selected) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await onDelete?.(selected.id);
      setIsDeleting(false);
      closeModal();
    } catch {
      setDeleteError("Delete failed. Please try again.");
      setIsDeleting(false);
    }
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    // Keyboard-triggered clicks (detail === 0) should not close the dialog
    if (e.detail === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const outside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;
    if (outside) closeModal();
  }

  function handleDialogCancel(e: React.SyntheticEvent) {
    // Intercept native Escape close so we can handle confirm state first
    e.preventDefault();
    if (confirmDelete) {
      setConfirmDelete(false);
    } else {
      closeModal();
    }
  }

  if (files.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No files uploaded yet.</p>
      </div>
    );
  }

  return (
    <>
      <ul className={styles.list} role="list">
        {files.map((file) => (
          <li key={file.id} className={styles.item}>
            <button
              type="button"
              className={styles.card}
              aria-label={`Preview ${file.filename}`}
              onClick={(e) => openModal(file, e.currentTarget)}
            >
              <img src={file.url} alt="" aria-hidden="true" className={styles.thumbnail} />
              <div className={styles.meta}>
                <span className={styles.filename}>{file.filename}</span>
                <span className={styles.fileDetails}>
                  <span className={styles.size}>{formatSize(file.size)}</span>
                  <span aria-hidden="true" className={styles.separator}>
                    ·
                  </span>
                  <span className={styles.date}>{formatDate(file.uploadedAt)}</span>
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {selected && (
        <dialog
          ref={dialogRef}
          className={styles.dialog}
          aria-labelledby="dialog-title"
          onClick={handleBackdropClick}
          onCancel={handleDialogCancel}
        >
          <button
            type="button"
            className={styles.closeButton}
            onClick={closeModal}
            aria-label="Close preview"
            autoFocus
          >
            <span aria-hidden="true">✕</span>
          </button>

          <div className={styles.imageWrap}>
            <ImagePreview
              src={selected.url}
              alt={selected.filename}
              className={styles.dialogImage}
            />
          </div>

          <footer className={styles.footer}>
            <h2 id="dialog-title" className={styles.dialogTitle}>
              {selected.filename}
            </h2>
            <p className={styles.detail}>
              {formatSize(selected.size)}
              <span aria-hidden="true"> · </span>
              {formatDate(selected.uploadedAt)}
            </p>

            {deleteError && (
              <ErrorMessage className={styles.deleteError}>{deleteError}</ErrorMessage>
            )}

            {confirmDelete ? (
              <div className={styles.deleteConfirm}>
                <p className={styles.deletePrompt}>Delete this file?</p>
                <div className={styles.deleteActions}>
                  <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? "Deleting…" : "Yes, delete"}
                  </Button>
                  <Button
                    variant="neutral"
                    onClick={() => setConfirmDelete(false)}
                    aria-label="Cancel delete"
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="destructive-outline"
                className={styles.deleteBtn}
                onClick={() => setConfirmDelete(true)}
              >
                Delete file
              </Button>
            )}
          </footer>
        </dialog>
      )}
    </>
  );
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
