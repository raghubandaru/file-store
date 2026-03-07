import express from "express";
import cors from "cors";
import { usersRouter } from "./routes/users";

const app = express();
const PORT = process.env.PORT ?? 3002;

app.use(cors({ origin: process.env.ALLOWED_ORIGIN }));
app.use(express.json());
app.use("/api/users", usersRouter);

app.listen(PORT, () => console.log(`[users-service] :${PORT}`));
