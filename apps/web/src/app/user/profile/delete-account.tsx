"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./profile.module.css";

export function DeleteAccount() {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setIsDeleting(true);
    setError(null);

    const res = await fetch("/api/user", { method: "DELETE" });

    if (!res.ok) {
      const { error: msg } = await res.json();
      setError(msg ?? "Something went wrong.");
      setIsDeleting(false);
      return;
    }

    router.push("/auth/login");
  }

  return (
    <section className={styles.dangerZone}>
      <h3 className={styles.dangerTitle}>Danger zone</h3>

      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}

      {confirm ? (
        <div className={styles.confirmRow}>
          <p className={styles.confirmText}>
            This will permanently delete your account and all uploaded files.
            Are you sure?
          </p>
          <div className={styles.confirmActions}>
            <button
              className={styles.deleteConfirmBtn}
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting…" : "Yes, delete my account"}
            </button>
            <button
              className={styles.cancelBtn}
              onClick={() => setConfirm(false)}
              disabled={isDeleting}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button className={styles.deleteBtn} onClick={() => setConfirm(true)}>
          Delete account
        </button>
      )}
    </section>
  );
}
