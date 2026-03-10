import express from "express";
import cors from "cors";
import { join } from "path";
import { filesRouter } from "./routes/files";
import { uploadRouter } from "./routes/upload";
import { isLocalStorage } from "./lib/storage";

const local = isLocalStorage();

const REQUIRED_ENV = [
  "DB_FILES",
  "ALLOWED_ORIGIN",
  ...(!local ? ["AWS_REGION", "AWS_ACCESS_KEY_RES", "AWS_SECRET_KEY_RES", "AWS_S3_BUCKET"] : []),
];
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

if (local) {
  const { writeLocalUpload } =
    require("./lib/storage/local") as typeof import("./lib/storage/local");

  app.put("/api/local-upload/*", express.raw({ type: "*/*", limit: "10mb" }), async (req, res) => {
    const key = req.path.slice("/api/local-upload/".length);
    try {
      await writeLocalUpload(key, req.body as Buffer);
      res.json({ ok: true });
    } catch (e) {
      console.error("[files-service] local-upload error:", e);
      res.status(500).json({ error: "Upload failed" });
    }
  });

  app.use("/uploads", express.static(join(process.cwd(), "uploads")));

  console.log("[files-service] storage: local disk (./uploads)");
} else {
  console.log("[files-service] storage: S3");
}

app.listen(PORT, () => console.log(`[files-service] :${PORT}`));
