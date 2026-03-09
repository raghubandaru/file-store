"use client";

import { useRouter } from "next/navigation";
import type { FileItem as TypesFileItem } from "@file-store/types";
import { FileList, PageHeading } from "@file-store/design-system";

// Map @file-store/types FileItem (createdAt) to design-system FileItem (uploadedAt)
function toDisplayItem(file: TypesFileItem) {
  return {
    id: file.id,
    filename: file.filename,
    size: file.size,
    url: file.url,
    uploadedAt: file.createdAt,
  };
}

export function FilesList({ files }: { files: TypesFileItem[] }) {
  const router = useRouter();

  async function handleDelete(id: string) {
    const res = await fetch(`/api/files/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error ?? "Delete failed");
    }
    router.refresh();
  }

  return (
    <>
      <PageHeading>Files</PageHeading>
      <FileList files={files.map(toDisplayItem)} onDelete={handleDelete} />
    </>
  );
}
