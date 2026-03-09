/**
 * HTTP client for the auth service (services/auth).
 *
 * All calls are server-side only. The BFF owns cookie management; the auth
 * service only receives/returns plain tokens.
 */

const AUTH_URL = process.env.AUTH_SERVICE_URL ?? "http://localhost:3001";

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string };
};

async function authFetch<T>(path: string, init: RequestInit): Promise<T> {
  const res = await fetch(`${AUTH_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...init.headers },
    ...init,
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({ error: "Auth error" }))) as { error?: string };
    throw new Error(body.error ?? "Auth error");
  }

  return res.json() as Promise<T>;
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  return authFetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function signupUser(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  return authFetch("/api/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function logoutUser(refreshToken: string): Promise<void> {
  await authFetch("/api/logout", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export async function refreshUserSession(
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string }> {
  return authFetch("/api/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

/**
 * Validates a refresh token against the auth service and returns the userId.
 * Called on every SSR request that needs authentication — keep latency low.
 */
export async function getSessionUser(refreshToken: string): Promise<{ userId: string } | null> {
  try {
    const res = await fetch(`${AUTH_URL}/api/session`, {
      headers: { Authorization: `Bearer ${refreshToken}` },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function deleteUserSessions(userId: string): Promise<void> {
  await fetch(`${AUTH_URL}/api/sessions/${userId}`, { method: "DELETE" });
}
