import express from "express";
import * as AuthController from "../controllers/AuthController.ts";
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

export default authRouter;
