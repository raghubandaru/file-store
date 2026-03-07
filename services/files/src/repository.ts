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

  return File.find({ userId }).sort({ createdAt: -1 }).limit(limit).lean();
}

export async function insertFile(data: Omit<FileDoc, "createdAt">) {
  await dbPromise;

  return File.create(data);
}

export async function findFileById(id: string, userId: string) {
  await dbPromise;

  return File.findOne({ _id: id, userId }).lean();
}

export async function deleteFileById(id: string) {
  await dbPromise;

  await File.deleteOne({ _id: id });
}

export async function findFileKeysByUserId(userId: string): Promise<string[]> {
  await dbPromise;

  const files = await File.find({ userId }).select("key").lean();
  return files.map((f) => f.key);
}

export async function deleteFilesByUserId(userId: string) {
  await dbPromise;

  await File.deleteMany({ userId });
}
