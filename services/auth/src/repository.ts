import dbPromise from "./lib/mongoose";
import { Session } from "./models/Session";
import mongoose from "mongoose";

export async function createSession(userId: string, refreshToken: string, expiresAt: Date) {
  await dbPromise;

  try {
    await Session.create({
      userId: new mongoose.Types.ObjectId(userId),
      refreshToken,
      expiresAt,
    });
  } catch (err) {
    console.error("[auth-service] createSession error:", err);
    throw new Error("Failed to create session");
  }
}

export async function findSession(refreshToken: string) {
  await dbPromise;

  try {
    return await Session.findOne({ refreshToken }).lean();
  } catch (err) {
    console.error("[auth-service] findSession error:", err);
    throw new Error("Failed to find session");
  }
}

export async function deleteSession(refreshToken: string) {
  await dbPromise;

  try {
    await Session.deleteOne({ refreshToken });
  } catch (err) {
    console.error("[auth-service] deleteSession error:", err);
    throw new Error("Failed to delete session");
  }
}

export async function deleteSessionsByUserId(userId: string) {
  await dbPromise;

  try {
    await Session.deleteMany({ userId });
  } catch (err) {
    console.error("[auth-service] deleteSessionsByUserId error:", err);
    throw new Error("Failed to delete sessions");
  }
}
