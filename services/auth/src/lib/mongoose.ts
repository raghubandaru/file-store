import mongoose from "mongoose";

const DB_AUTH = process.env.DB_AUTH!;

declare global {
  var _mongoosePromise: Promise<typeof mongoose> | undefined;
}

if (!global._mongoosePromise) {
  global._mongoosePromise = mongoose.connect(DB_AUTH, { dbName: "playbook_auth" });
}

export default global._mongoosePromise!;
