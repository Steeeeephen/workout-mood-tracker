import express from "express";
import * as AuthController from "../controllers/AuthController.ts";
import { authenticateToken } from "../middleware/authMiddleware.ts";
import { validateBody } from "../middleware/validateBody.ts";
import { loginSchema, registerSchema } from "../schemas/userSchemas.ts";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(registerSchema),
  AuthController.registerUser,
);
authRouter.post("/login", validateBody(loginSchema), AuthController.loginUser);
authRouter.post("/logout", AuthController.logoutUser);
authRouter.post(
  "/logout-all",
  authenticateToken,
  AuthController.logoutAllDevices,
);

export default authRouter;
