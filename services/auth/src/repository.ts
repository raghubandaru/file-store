import dbPromise from "./lib/mongoose";
import { Session } from "./models/Session";
import mongoose from "mongoose";

export async function createSession(
  userId: string,
  refreshToken: string,
  expiresAt: Date,
) {
  await dbPromise;

  await Session.create({
    userId: new mongoose.Types.ObjectId(userId),
    refreshToken,
    expiresAt,
  });
}

export async function findSession(refreshToken: string) {
  await dbPromise;

  return Session.findOne({ refreshToken }).lean();
}

export async function deleteSession(refreshToken: string) {
  await dbPromise;

  await Session.deleteOne({ refreshToken });
}

export async function deleteSessionsByUserId(userId: string) {
  await dbPromise;

  await Session.deleteMany({ userId });
}
