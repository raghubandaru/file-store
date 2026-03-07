import * as sessionRepo from "./repository";
import { createAccessToken, generateRefreshToken } from "./jwt";
import { createUserAccount, verifyUserCredentials } from "./lib/users-client";

const REFRESH_DAYS = 30;

async function createSession(userId: string) {
  const accessToken = createAccessToken(userId);
  const refreshToken = generateRefreshToken();

  const expires = new Date();
  expires.setDate(expires.getDate() + REFRESH_DAYS);

  await sessionRepo.createSession(userId, refreshToken, expires);

  return { accessToken, refreshToken };
}

export async function signup(name: string, email: string, password: string) {
  const user = await createUserAccount(name, email, password);

  const { accessToken, refreshToken } = await createSession(user.id);

  return { accessToken, refreshToken, user };
}

export async function login(email: string, password: string) {
  const user = await verifyUserCredentials(email, password);

  const { accessToken, refreshToken } = await createSession(user.id);

  return { accessToken, refreshToken, user };
}

export async function refreshSession(oldRefreshToken: string) {
  const session = await sessionRepo.findSession(oldRefreshToken);

  if (!session) throw new Error("Invalid session");
  if (new Date(session.expiresAt) < new Date()) throw new Error("Expired");

  const userId = session.userId.toString();

  // Token rotation — invalidate old, issue new
  await sessionRepo.deleteSession(oldRefreshToken);

  const newRefreshToken = generateRefreshToken();
  const expires = new Date();
  expires.setDate(expires.getDate() + REFRESH_DAYS);
  await sessionRepo.createSession(userId, newRefreshToken, expires);

  const accessToken = createAccessToken(userId);

  return { accessToken, refreshToken: newRefreshToken };
}

export async function logout(refreshToken: string) {
  await sessionRepo.deleteSession(refreshToken);
}
