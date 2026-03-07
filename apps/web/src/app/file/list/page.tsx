import { redirect } from "next/navigation";
import { getSessionUserId } from "@/services/auth/server";
import { getFiles } from "@/lib/files-client";
import { FilesList } from "./files-list";

export const dynamic = "force-dynamic";

export default async function FilesPage() {
  const userId = await getSessionUserId();

  if (!userId) redirect("/auth/login");

  const files = await getFiles(userId);

  return <FilesList files={files} />;
}
