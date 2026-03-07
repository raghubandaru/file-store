import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { loginUser } from "@/lib/auth-client";
import { loginSchema } from "@file-store/schemas/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const result = loginSchema.safeParse(body);

  if (!result.success) {
    const message = result.error.issues[0]?.message ?? "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    const { email, password } = result.data;
    const { accessToken, refreshToken, user } = await loginUser(email, password);

    (await cookies()).set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.HTTPS_ENABLED === "true",
      sameSite: "strict",
      path: "/",
    });

    return NextResponse.json({ accessToken, user });
  } catch {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
}
