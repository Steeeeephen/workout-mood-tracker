import express from "express";
import * as UserController from "../controllers/UserController.ts";
import { authenticateToken } from "../middleware/authMiddleware.ts";

const usersRouter = express.Router();

usersRouter.get("/me", authenticateToken, UserController.getCurrentUser);

usersRouter.patch(
  "/me/update",
  authenticateToken,
  UserController.updateCurrentUser,
);

export default usersRouter;
