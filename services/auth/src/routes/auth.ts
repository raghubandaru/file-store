import { Router, Request, Response } from "express";
import { login, signup, logout, refreshSession } from "../service";
import { findSession } from "../repository";

export const authRouter = Router();

// POST /api/login
authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const data = await login(email, password);
    res.json(data);
  } catch {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// POST /api/signup
authRouter.post("/signup", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };
    const data = await signup(name, email, password);
    res.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Signup failed";
    const status = message === "User exists" ? 409 : 400;
    res.status(status).json({ error: message });
  }
});

// POST /api/logout
authRouter.post("/logout", async (req: Request, res: Response) => {
  const { refreshToken } = req.body as { refreshToken?: string };
  if (refreshToken) await logout(refreshToken);
  res.json({ success: true });
});

// POST /api/refresh
authRouter.post("/refresh", async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body as { refreshToken: string };
    if (!refreshToken) throw new Error("No token");
    const data = await refreshSession(refreshToken);
    res.json(data);
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
});

// GET /api/session — Authorization: Bearer <refreshToken>
// Used by the BFF to resolve a refresh token to a userId for SSR.
authRouter.get("/session", async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  const session = await findSession(token);
  if (!session || new Date(session.expiresAt) < new Date()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  res.json({ userId: session.userId.toString() });
});
