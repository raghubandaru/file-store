import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId } from "@/services/auth/server";
import { getUploadUrl } from "@/lib/files-client";
import { uploadRequestSchema } from "@file-store/schemas";

export async function POST(req: NextRequest) {
  const userId = await getSessionUserId();

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const result = uploadRequestSchema.safeParse(body);

  if (!result.success) {
    const message = result.error.issues[0]?.message ?? "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { filename, contentType } = result.data;

  try {
    const uploadResult = await getUploadUrl(userId, filename, contentType);
    return NextResponse.json(uploadResult);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to generate upload URL";
    console.error("[upload-url] Error:", e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
