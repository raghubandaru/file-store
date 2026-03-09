import dbPromise from "./lib/mongoose";
import { User } from "./models/User";

export async function findUserByEmail(email: string) {
  await dbPromise;

  try {
    return await User.findOne({ email }).lean();
  } catch (err) {
    console.error("[users-service] findUserByEmail error:", err);
    throw new Error("Failed to find user");
  }
}

export async function findUserById(id: string) {
  await dbPromise;

  try {
    return await User.findById(id).lean();
  } catch (err) {
    console.error("[users-service] findUserById error:", err);
    throw new Error("Failed to find user");
  }
}

export async function createUser(data: { name: string; email: string; password: string }) {
  await dbPromise;

  try {
    return await User.create(data);
  } catch (err: unknown) {
    const isDuplicate =
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: unknown }).code === 11000;
    if (isDuplicate) throw new Error("User exists");
    console.error("[users-service] createUser error:", err);
    throw new Error("Failed to create user");
  }
}

export async function deleteUser(userId: string) {
  await dbPromise;

  try {
    await User.deleteOne({ _id: userId });
  } catch (err) {
    console.error("[users-service] deleteUser error:", err);
    throw new Error("Failed to delete user");
  }
}
