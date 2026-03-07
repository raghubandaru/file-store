import type { UserProfile } from "@file-store/types";
import { deleteUserFiles } from "@/lib/files-client";
import { getUserById, deleteUserAccount } from "@/lib/users-client";

export async function getUser(userId: string): Promise<UserProfile> {
  return getUserById(userId);
}

export async function deleteUser(userId: string) {
  try {
    await deleteUserFiles(userId);
  } catch (e) {
    console.error(`[deleteUser] Failed to delete files for user ${userId}:`, e);
  }

  await deleteUserAccount(userId);
}
