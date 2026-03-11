import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionUserId } from "@/services/auth/server";
import { logoutUser } from "@/lib/auth-client";
import { deleteUser } from "@/services/user/service";

export async function DELETE() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const userId = await getSessionUserId();

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await deleteUser(userId);
    if (refreshToken) {
      await logoutUser(refreshToken);
    }
    cookieStore.delete("refreshToken");
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
