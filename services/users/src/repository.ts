import dbPromise from "./lib/mongoose";
import { User } from "./models/User";

export async function findUserByEmail(email: string) {
  await dbPromise;

  return User.findOne({ email }).lean();
}

export async function findUserById(id: string) {
  await dbPromise;

  return User.findById(id).lean();
}

export async function createUser(data: { name: string; email: string; password: string }) {
  await dbPromise;

  return User.create(data);
}

export async function deleteUser(userId: string) {
  await dbPromise;

  await User.deleteOne({ _id: userId });
}
