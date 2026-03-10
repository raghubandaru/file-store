import { mkdir, writeFile, unlink } from "fs/promises";
import { join, dirname } from "path";
import { v4 as uuid } from "uuid";
import type { StorageAdapter } from "../storage";

const UPLOADS_DIR = join(process.cwd(), "uploads");
const BASE_URL = process.env.LOCAL_FILES_BASE_URL ?? "http://localhost:3003";

export function createLocalAdapter(): StorageAdapter {
  return {
    async getUploadUrl(userId, filename) {
      const key = `${userId}/${uuid()}-${filename}`;
      return {
        uploadUrl: `${BASE_URL}/api/local-upload/${key}`,
        fileUrl: `${BASE_URL}/uploads/${key}`,
        key,
      };
    },

    async getReadUrl(_key, storedUrl) {
      return storedUrl;
    },

    async deleteObject(key) {
      await unlink(join(UPLOADS_DIR, key)).catch(() => {});
    },

    async deleteObjects(keys) {
      await Promise.all(keys.map((key) => unlink(join(UPLOADS_DIR, key)).catch(() => {})));
    },
  };
}

export async function writeLocalUpload(key: string, data: Buffer): Promise<void> {
  const filePath = join(UPLOADS_DIR, key);
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, data);
}
