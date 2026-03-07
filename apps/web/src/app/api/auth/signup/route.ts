import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signupUser } from "@/lib/auth-client";
import { signupSchema } from "@file-store/schemas/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const result = signupSchema.safeParse(body);

  if (!result.success) {
    const message = result.error.issues[0]?.message ?? "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    const { name, email, password } = result.data;
    const { accessToken, refreshToken, user } = await signupUser(name, email, password);

    (await cookies()).set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.HTTPS_ENABLED === "true",
      sameSite: "strict",
      path: "/",
    });

    return NextResponse.json({ accessToken, user });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Signup failed";
    const status = message === "User exists" ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
