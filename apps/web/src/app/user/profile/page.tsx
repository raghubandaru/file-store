import type { Metadata } from "next";
export const metadata: Metadata = { title: "Profile" };

import { redirect } from "next/navigation";
import { PageHeading } from "@file-store/design-system";
import { getSessionUserId } from "@/services/auth/server";
import { getUser } from "@/services/user/service";
import { DeleteAccount } from "@/features/user/DeleteAccount/DeleteAccount";
import styles from "./profile.module.css";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const userId = await getSessionUserId();

  if (!userId) redirect("/auth/login");

  const user = await getUser(userId);

  return (
    <div className={styles.page}>
      <PageHeading>Profile</PageHeading>

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
