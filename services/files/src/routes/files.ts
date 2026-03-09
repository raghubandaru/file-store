import { Router, Request, Response } from "express";
import type { FileItem } from "@file-store/types";
import { getFiles, saveFile, deleteFile, deleteUserFiles } from "../service";

export const filesRouter = Router();

filesRouter.get("/", async (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  if (!userId) return res.status(400).json({ error: "userId required" });
  try {
    const raw = await getFiles(userId);
    const files: FileItem[] = raw.map((f) => ({
      id: (f._id as unknown as { toString(): string }).toString(),
      filename: f.filename,
      contentType: f.contentType,
      size: f.size,
      createdAt: new Date(f.createdAt).toISOString(),
      url: f.url,
    }));
    res.json(files);
  } catch (e) {
    console.error("[files-service] GET / error:", e);
    res.status(500).json({ error: "Internal error" });
  }
});

filesRouter.post("/", async (req: Request, res: Response) => {
  const { userId, ...data } = req.body as {
    userId: string;
    key: string;
    fileUrl: string;
    filename: string;
    contentType: string;
    size: number;
  };
  if (!userId) return res.status(400).json({ error: "userId required" });
  try {
    const doc = await saveFile(userId, data);
    const file: FileItem = {
      id: doc._id.toString(),
      filename: doc.filename,
      contentType: doc.contentType,
      size: doc.size,
      createdAt: new Date(doc.createdAt).toISOString(),
      url: doc.url,
    };
    res.json(file);
  } catch (e) {
    console.error("[files-service] POST / error:", e);
    res.status(500).json({ error: "Internal error" });
  }
});

filesRouter.delete("/user", async (req: Request, res: Response) => {
  const { userId } = req.body as { userId: string };
  if (!userId) return res.status(400).json({ error: "userId required" });
  try {
    await deleteUserFiles(userId);
    res.json({ success: true });
  } catch (e) {
    console.error("[files-service] DELETE /user error:", e);
    res.status(500).json({ error: "Internal error" });
  }
});

filesRouter.delete("/:fileId", async (req: Request, res: Response) => {
  const { userId } = req.body as { userId: string };
  if (!userId) return res.status(400).json({ error: "userId required" });
  try {
    await deleteFile(userId, req.params.fileId as string);
    res.json({ success: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Delete failed";
    if (message !== "File not found") console.error("[files-service] DELETE /:fileId error:", e);
    res.status(400).json({ error: message });
  }
});
