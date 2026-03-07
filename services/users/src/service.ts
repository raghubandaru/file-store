import bcrypt from "bcrypt";
import type { UserProfile } from "@file-store/types";
import * as userRepo from "./repository";

export async function createUser(
  name: string,
  email: string,
  password: string
): Promise<{ id: string; email: string }> {
  const existing = await userRepo.findUserByEmail(email);
  if (existing) throw new Error("User exists");

  const hashed = await bcrypt.hash(password, 12);
  const user = await userRepo.createUser({ name, email, password: hashed });

  return { id: user._id.toString(), email: user.email };
}

export async function verifyCredentials(
  email: string,
  password: string
): Promise<{ id: string; email: string }> {
  const user = await userRepo.findUserByEmail(email);
  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  return { id: user._id.toString(), email: user.email };
}

export async function getUserById(userId: string): Promise<UserProfile> {
  const user = await userRepo.findUserById(userId);
  if (!user) throw new Error("Not found");

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };
}

export async function deleteUser(userId: string): Promise<void> {
  await userRepo.deleteUser(userId);
}
