import express from "express";
import { prisma } from "./src/lib/prisma.ts";
import usersRouter from "./src/routes/usersRouter.ts";
import entriesRouter from "./src/routes/entriesRouter.ts";
import authRouter from "./src/routes/authRoutes.ts";
import cors from "cors";

const app = express();
const PORT = 3000;

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

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
