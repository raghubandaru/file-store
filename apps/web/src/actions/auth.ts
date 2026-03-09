"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginUser, logoutUser, signupUser } from "@/lib/auth-client";
import { loginSchema, signupSchema, fieldErrors } from "@file-store/schemas/auth";
import type { ActionState } from "@file-store/types";

export async function loginAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const result = loginSchema.safeParse(raw);
  if (!result.success) return { errors: fieldErrors(result.error) };

  try {
    const { refreshToken } = await loginUser(result.data.email, result.data.password);

    (await cookies()).set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.HTTPS_ENABLED === "true",
      sameSite: "strict",
      path: "/",
    });
  } catch (e) {
    return {
      errors: {
        general: e instanceof Error ? e.message : "Something went wrong",
      },
    };
  }

  redirect("/user/profile");
}

export async function signupAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const result = signupSchema.safeParse(raw);
  if (!result.success) return { errors: fieldErrors(result.error) };

  try {
    const { refreshToken } = await signupUser(
      result.data.name,
      result.data.email,
      result.data.password
    );

    (await cookies()).set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.HTTPS_ENABLED === "true",
      sameSite: "strict",
      path: "/",
    });
  } catch (e) {
    return {
      errors: {
        general: e instanceof Error ? e.message : "Something went wrong",
      },
    };
  }

  redirect("/user/profile");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (refreshToken) await logoutUser(refreshToken);

  cookieStore.delete("refreshToken");

  redirect("/auth/login");
}
