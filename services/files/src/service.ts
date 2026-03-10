import { createStorage } from "./lib/storage";
import {
  deleteFileById,
  deleteFilesByUserId,
  findFileById,
  findFileKeysByUserId,
  findFiles,
  insertFile,
} from "./repository";

const storage = createStorage();

export async function getFiles(userId: string) {
  const files = await findFiles(userId);
  return Promise.all(
    files.map(async (file) => {
      const url = await storage.getReadUrl(file.key, file.url);
      return { ...file, url };
    })
  );
}

export async function getUploadUrl(userId: string, filename: string, contentType: string) {
  return storage.getUploadUrl(userId, filename, contentType);
}

export async function deleteFile(userId: string, fileId: string) {
  const file = await findFileById(fileId, userId);
  if (!file) throw new Error("File not found");
  await storage.deleteObject(file.key);
  await deleteFileById(fileId);
}

export async function deleteUserFiles(userId: string) {
  const keys = await findFileKeysByUserId(userId);
  await storage.deleteObjects(keys);
  await deleteFilesByUserId(userId);
}

export async function saveFile(
  userId: string,
  data: {
    key: string;
    fileUrl: string;
    filename: string;
    contentType: string;
    size: number;
  }
) {
  try {
    return await insertFile({
      userId,
      key: data.key,
      url: data.fileUrl,
      filename: data.filename,
      contentType: data.contentType,
      size: data.size,
    });
  } catch (err) {
    // DB save failed — clean up the already-stored object to avoid orphans
    await storage.deleteObject(data.key).catch((cleanupErr) => {
      console.error("[files-service] Failed to clean up orphaned object:", data.key, cleanupErr);
    });
    throw err;
  }
}
