import dbPromise from "./lib/mongoose";
import { File } from "./models/File";

export type FileDoc = {
  userId: string;
  key: string;
  url: string;
  filename: string;
  contentType: string;
  size: number;
  createdAt: Date;
};

export async function findFiles(userId: string, limit = 50) {
  await dbPromise;

  try {
    return await File.find({ userId }).sort({ createdAt: -1 }).limit(limit).lean();
  } catch (err) {
    console.error("[files-service] findFiles error:", err);
    throw new Error("Failed to fetch files");
  }
}

export async function insertFile(data: Omit<FileDoc, "createdAt">) {
  await dbPromise;

  try {
    return await File.create(data);
  } catch (err) {
    console.error("[files-service] insertFile error:", err);
    throw new Error("Failed to save file");
  }
}

export async function findFileById(id: string, userId: string) {
  await dbPromise;

  try {
    return await File.findOne({ _id: id, userId }).lean();
  } catch (err) {
    console.error("[files-service] findFileById error:", err);
    throw new Error("Failed to find file");
  }
}

export async function deleteFileById(id: string) {
  await dbPromise;

  try {
    await File.deleteOne({ _id: id });
  } catch (err) {
    console.error("[files-service] deleteFileById error:", err);
    throw new Error("Failed to delete file");
  }
}

export async function findFileKeysByUserId(userId: string): Promise<string[]> {
  await dbPromise;

  try {
    const files = await File.find({ userId }).select("key").lean();
    return files.map((f) => f.key);
  } catch (err) {
    console.error("[files-service] findFileKeysByUserId error:", err);
    throw new Error("Failed to fetch file keys");
  }
}

export async function deleteFilesByUserId(userId: string) {
  await dbPromise;

  try {
    await File.deleteMany({ userId });
  } catch (err) {
    console.error("[files-service] deleteFilesByUserId error:", err);
    throw new Error("Failed to delete user files");
  }
}
