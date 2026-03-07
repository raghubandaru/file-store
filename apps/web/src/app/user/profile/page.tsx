import { redirect } from "next/navigation";
import { getSessionUserId } from "@/services/auth/server";
import { getUser } from "@/services/user/service";
import { DeleteAccount } from "./delete-account";
import styles from "./profile.module.css";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const userId = await getSessionUserId();

  if (!userId) redirect("/auth/login");

  const user = await getUser(userId);

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Profile</h1>

      <section className={styles.section}>
        <dl className={styles.fields}>
          <div className={styles.fieldRow}>
            <dt className={styles.fieldLabel}>Name</dt>
            <dd className={styles.fieldValue}>{user.name}</dd>
          </div>
          <div className={styles.fieldRow}>
            <dt className={styles.fieldLabel}>Email</dt>
            <dd className={styles.fieldValue}>{user.email}</dd>
          </div>
        </dl>
      </section>

      <DeleteAccount />
    </div>
  );
}
