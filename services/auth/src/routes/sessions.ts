import { Router, Request, Response } from "express";
import { deleteSessionsByUserId } from "../repository";

export const sessionsRouter = Router();

// DELETE /api/sessions/:userId
sessionsRouter.delete("/:userId", async (req: Request, res: Response) => {
  try {
    await deleteSessionsByUserId(req.params.userId as string);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Internal error" });
  }
});
