import mongoose from "mongoose";

const DB_USERS = process.env.DB_USERS!;

declare global {
  var _mongoosePromise: Promise<typeof mongoose> | undefined;
}

if (!global._mongoosePromise) {
  global._mongoosePromise = mongoose.connect(DB_USERS, { dbName: "filestore_users" });
}

export default global._mongoosePromise!;
