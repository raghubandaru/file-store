/**
 * HTTP client for the files service (services/files).
 *
 * All calls are server-side only. The files service owns S3 and file metadata;
 * the BFF never touches AWS directly.
 */

import type { FileItem } from "@file-store/types";

const FILES_URL = process.env.FILES_SERVICE_URL ?? "http://localhost:3003";

async function filesFetch<T>(path: string, init: RequestInit): Promise<T> {
  const res = await fetch(`${FILES_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...init.headers },
    ...init,
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({ error: "Files error" }))) as { error?: string };
    throw new Error(body.error ?? "Files error");
  }

  return res.json() as Promise<T>;
}

export async function getFiles(userId: string): Promise<FileItem[]> {
  return filesFetch(`/api/files?userId=${encodeURIComponent(userId)}`, {
    method: "GET",
  });
}

export async function saveFile(
  userId: string,
  data: { key: string; fileUrl: string; filename: string; contentType: string; size: number }
): Promise<FileItem> {
  return filesFetch("/api/files", {
    method: "POST",
    body: JSON.stringify({
      userId,
      key: data.key,
      fileUrl: data.fileUrl,
      filename: data.filename,
      contentType: data.contentType,
      size: data.size,
    }),
  });
}

export async function deleteFile(userId: string, fileId: string): Promise<void> {
  await filesFetch(`/api/files/${fileId}`, {
    method: "DELETE",
    body: JSON.stringify({ userId }),
  });
}

export async function deleteUserFiles(userId: string): Promise<void> {
  await filesFetch("/api/files/user", {
    method: "DELETE",
    body: JSON.stringify({ userId }),
  });
}

export async function getUploadUrl(
  userId: string,
  filename: string,
  contentType: string
): Promise<{ uploadUrl: string; fileUrl: string; key: string }> {
  return filesFetch("/api/upload-url", {
    method: "POST",
    body: JSON.stringify({ userId, filename, contentType }),
  });
}
