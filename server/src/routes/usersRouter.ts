import express from "express";
import * as UserController from "../controllers/UserController.ts";
import { authenticateToken } from "../middleware/authMiddleware.ts";
import { validateBody } from "../middleware/validateBody.ts";
import { updateUserSchema } from "../schemas/userSchemas.ts";

const usersRouter = express.Router();

usersRouter.get("/me", authenticateToken, UserController.getCurrentUser);

usersRouter.patch(
  "/me/update",
  authenticateToken,
  validateBody(updateUserSchema),
  UserController.updateCurrentUser,
);

export default usersRouter;
