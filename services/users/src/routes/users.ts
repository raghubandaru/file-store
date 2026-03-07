import { Router, Request, Response } from "express";
import {
  createUser,
  getUserById,
  deleteUser,
  verifyCredentials,
} from "../service";

export const usersRouter = Router();

// POST /api/users/verify — must be registered before /:userId to avoid param capture
usersRouter.post("/verify", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const user = await verifyCredentials(email, password);
    res.json(user);
  } catch {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// POST /api/users
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
    res.status(status).json({ error: message });
  }
});

// GET /api/users/:userId
usersRouter.get("/:userId", async (req: Request, res: Response) => {
  try {
    const user = await getUserById(req.params.userId as string);
    res.json(user);
  } catch {
    res.status(404).json({ error: "Not found" });
  }
});

// DELETE /api/users/:userId
usersRouter.delete("/:userId", async (req: Request, res: Response) => {
  try {
    await deleteUser(req.params.userId as string);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Internal error" });
  }
});
