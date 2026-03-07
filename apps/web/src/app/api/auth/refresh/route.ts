import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { refreshUserSession } from "@/lib/auth-client";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  try {
    const { accessToken, refreshToken: newRefreshToken } = await refreshUserSession(refreshToken);

    cookieStore.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.HTTPS_ENABLED === "true",
      sameSite: "strict",
      path: "/",
    });

    return NextResponse.json({ accessToken });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
