import mongoose from "mongoose";

const DB_FILES = process.env.DB_FILES!;

declare global {
  var _mongoosePromise: Promise<typeof mongoose> | undefined;
}

async function connectWithRetry(
  uri: string,
  dbName: string,
  maxRetries = 5
): Promise<typeof mongoose> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await mongoose.connect(uri, { dbName });
    } catch (err) {
      if (attempt === maxRetries) {
        console.error(
          `[files-service] MongoDB connection failed after ${maxRetries} attempts:`,
          err
        );
        throw err;
      }
      const delay = Math.min(1000 * 2 ** (attempt - 1), 16000);
      console.error(
        `[files-service] MongoDB connection attempt ${attempt} failed. Retrying in ${delay}ms...`,
        err
      );
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw new Error("Unreachable");
}

if (!global._mongoosePromise) {
  global._mongoosePromise = connectWithRetry(DB_FILES, "filestore_files");
}

export default global._mongoosePromise!;
