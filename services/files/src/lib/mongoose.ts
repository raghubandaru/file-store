import mongoose from "mongoose";

const DB_FILES = process.env.DB_FILES!;

declare global {
  var _mongoosePromise: Promise<typeof mongoose> | undefined;
}

if (!global._mongoosePromise) {
  global._mongoosePromise = mongoose.connect(DB_FILES, {
    dbName: "playbook_files",
  });
}

export default global._mongoosePromise!;
