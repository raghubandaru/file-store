export interface StorageAdapter {
  getUploadUrl(
    userId: string,
    filename: string,
    contentType: string
  ): Promise<{ uploadUrl: string; fileUrl: string; key: string }>;
  getReadUrl(key: string, storedUrl: string): Promise<string>;
  deleteObject(key: string): Promise<void>;
  deleteObjects(keys: string[]): Promise<void>;
}

export function isLocalStorage(): boolean {
  return process.env.STORAGE !== "s3";
}

export function createStorage(): StorageAdapter {
  if (isLocalStorage()) {
    const { createLocalAdapter } = require("./storage/local") as typeof import("./storage/local");
    return createLocalAdapter();
  }
  const { createS3Adapter } = require("./storage/s3") as typeof import("./storage/s3");
  return createS3Adapter();
}
