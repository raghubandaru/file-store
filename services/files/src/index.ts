import express from "express";
import cors from "cors";
import { filesRouter } from "./routes/files";
import { uploadRouter } from "./routes/upload";

const REQUIRED_ENV = [
  "DB_FILES",
  "AWS_REGION",
  "AWS_ACCESS_KEY_RES",
  "AWS_SECRET_KEY_RES",
  "AWS_S3_BUCKET",
  "ALLOWED_ORIGIN",
] as const;
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`[files-service] Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

const app = express();
const PORT = process.env.PORT ?? 3003;

app.use(cors({ origin: process.env.ALLOWED_ORIGIN }));
app.use(express.json());
app.use("/api/files", filesRouter);
app.use("/api/upload-url", uploadRouter);

app.listen(PORT, () => console.log(`[files-service] :${PORT}`));
