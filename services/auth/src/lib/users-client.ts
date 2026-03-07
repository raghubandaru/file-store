/**
 * HTTP client for the users service (services/users).
 * Called server-side only from the auth service during login and signup.
 */

const USERS_URL = process.env.USERS_SERVICE_URL ?? "http://localhost:3002";

async function usersFetch<T>(path: string, init: RequestInit): Promise<T> {
  const res = await fetch(`${USERS_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...init.headers },
    ...init,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Users error" })) as { error?: string };
    const { error } = body;
    throw new Error(error ?? "Users error");
  }

  return res.json() as Promise<T>;
}

export async function createUserAccount(
  name: string,
  email: string,
  password: string,
): Promise<{ id: string; email: string }> {
  return usersFetch<{ id: string; email: string }>("/api/users", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function verifyUserCredentials(
  email: string,
  password: string,
): Promise<{ id: string; email: string }> {
  return usersFetch<{ id: string; email: string }>("/api/users/verify", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}
