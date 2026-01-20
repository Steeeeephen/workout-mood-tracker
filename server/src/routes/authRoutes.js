import express from 'express';
import * as AuthController from '../controllers/AuthController.js';
import {defaults} from "pg";

const authRouter = express.Router();

authRouter.post('/register', AuthController.registerUser);
authRouter.post('/login', AuthController.loginUser);
authRouter.post('/logout', AuthController.logoutUser);

export default authRouter;