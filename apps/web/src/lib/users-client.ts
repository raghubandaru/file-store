/**
 * HTTP client for the users service (services/users).
 * All calls are server-side only.
 */

import type { UserProfile } from "@file-store/types";

const USERS_URL = process.env.USERS_SERVICE_URL ?? "http://localhost:3002";

async function usersFetch<T>(path: string, init: RequestInit): Promise<T> {
  const res = await fetch(`${USERS_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...init.headers },
    ...init,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Users error" })) as { error?: string };
    throw new Error(body.error ?? "Users error");
  }

  return res.json() as Promise<T>;
}

export async function getUserById(userId: string): Promise<UserProfile> {
  return usersFetch(`/api/users/${userId}`, { method: "GET" });
}

export async function deleteUserAccount(userId: string): Promise<void> {
  await usersFetch(`/api/users/${userId}`, { method: "DELETE" });
}
