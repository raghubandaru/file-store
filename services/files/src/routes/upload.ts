import { Router, Request, Response } from "express";
import { getUploadUrl } from "../service";

export const uploadRouter = Router();

uploadRouter.post("/", async (req: Request, res: Response) => {
  const { userId, filename, contentType } = req.body as {
    userId?: string;
    filename?: string;
    contentType?: string;
  };
  if (!userId || !filename || !contentType) {
    return res.status(400).json({ error: "userId, filename and contentType are required" });
  }
  try {
    const data = await getUploadUrl(userId, filename, contentType);
    res.json(data);
  } catch (e) {
    console.error("[files-service] POST /upload-url error:", e);
    res.status(500).json({ error: "Internal error" });
  }
});
