import type { Metadata } from "next";
export const metadata: Metadata = { title: "Upload" };

import { redirect } from "next/navigation";
import { getSessionUserId } from "@/services/auth/server";
import { UploadForm } from "./upload-form";

export default async function UploadPage() {
  const userId = await getSessionUserId();

  if (!userId) redirect("/auth/login");

  return <UploadForm />;
}
