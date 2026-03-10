"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, ErrorMessage } from "@file-store/design-system";
import styles from "./DeleteAccount.module.css";

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

    router.refresh();
    router.push("/auth/login");
  }

  return (
    <section className={styles.dangerZone}>
      <h3 className={styles.dangerTitle}>Danger zone</h3>

      {error && <ErrorMessage className={styles.error}>{error}</ErrorMessage>}

      {confirm ? (
        <div className={styles.confirmRow}>
          <p className={styles.confirmText}>
            This will permanently delete your account and all uploaded files. Are you sure?
          </p>
          <div className={styles.confirmActions}>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting…" : "Yes, delete my account"}
            </Button>
            <Button variant="neutral" onClick={() => setConfirm(false)} disabled={isDeleting}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="destructive-outline" onClick={() => setConfirm(true)}>
          Delete account
        </Button>
      )}
    </section>
  );
}
