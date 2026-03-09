import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId } from "@/services/auth/server";
import { saveFile } from "@/lib/files-client";

export async function POST(req: NextRequest) {
  const userId = await getSessionUserId();

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { key, fileUrl, filename, contentType, size } = body as {
      key?: string;
      fileUrl?: string;
      filename?: string;
      contentType?: string;
      size?: number;
    };

    if (!key || !fileUrl || !filename || !contentType || size == null) {
      return NextResponse.json({ error: "Missing required file fields" }, { status: 400 });
    }

    const result = await saveFile(userId, { key, fileUrl, filename, contentType, size });
    return NextResponse.json(result);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to save file";
    console.error("[save-file] Error:", e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
