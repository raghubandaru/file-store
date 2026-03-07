import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth";
import { sessionsRouter } from "./routes/sessions";

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors({ origin: process.env.ALLOWED_ORIGIN }));
app.use(express.json());
app.use("/api", authRouter);
app.use("/api/sessions", sessionsRouter);

app.listen(PORT, () => console.log(`[auth-service] :${PORT}`));
