import express from "express";
import usersRouter from "./routes/usersRouter.ts";
import entriesRouter from "./routes/entriesRouter.ts";
import authRouter from "./routes/authRoutes.ts";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use("/api/users", usersRouter);
app.use("/api/entries", entriesRouter);
app.use("/api/auth", authRouter);

export default app;
