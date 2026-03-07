import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { logoutUser } from "@/lib/auth-client";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (refreshToken) await logoutUser(refreshToken).catch(() => null);

  cookieStore.delete("refreshToken");

  return NextResponse.json({ success: true });
}
