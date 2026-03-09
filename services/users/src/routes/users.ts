import { Router, Request, Response } from "express";
import { createUser, getUserById, deleteUser, verifyCredentials } from "../service";

export const usersRouter = Router();

usersRouter.post("/verify", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const user = await verifyCredentials(email, password);
    res.json(user);
  } catch (e) {
    console.error("[users-service] POST /verify error:", e);
    res.status(401).json({ error: "Invalid credentials" });
  }
});

usersRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };
    const user = await createUser(name, email, password);
    res.status(201).json(user);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal error";
    const status = message === "User exists" ? 409 : 500;
    if (status !== 409) console.error("[users-service] POST / error:", e);
    res.status(status).json({ error: message });
  }
});

usersRouter.get("/:userId", async (req: Request, res: Response) => {
  try {
    const user = await getUserById(req.params.userId as string);
    res.json(user);
  } catch (e) {
    console.error("[users-service] GET /:userId error:", e);
    res.status(404).json({ error: "Not found" });
  }
});

usersRouter.delete("/:userId", async (req: Request, res: Response) => {
  try {
    await deleteUser(req.params.userId as string);
    res.json({ success: true });
  } catch (e) {
    console.error("[users-service] DELETE /:userId error:", e);
    res.status(500).json({ error: "Internal error" });
  }
});
