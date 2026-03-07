import express from "express";
import cors from "cors";
import { filesRouter } from "./routes/files";
import { uploadRouter } from "./routes/upload";

const app = express();
const PORT = process.env.PORT ?? 3003;

app.use(cors({ origin: process.env.ALLOWED_ORIGIN ?? "http://localhost:3000" }));
app.use(express.json());
app.use("/api/files", filesRouter);
app.use("/api/upload-url", uploadRouter);

app.listen(PORT, () => console.log(`[files-service] :${PORT}`));
