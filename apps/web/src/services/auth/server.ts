import { cookies } from "next/headers";
import { getSessionUser } from "@/lib/auth-client";

export async function getSessionUserId(): Promise<string | null> {
  const refreshToken = (await cookies()).get("refreshToken")?.value;

  if (!refreshToken) return null;

  const session = await getSessionUser(refreshToken);

  return session?.userId ?? null;
}
