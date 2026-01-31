import express from 'express';
import * as UserController from "../controllers/UserController.js";
import {authenticateToken} from "../middleware/authMiddleware.js";


const usersRouter = express.Router();


usersRouter.post('/', authenticateToken, UserController.createUser)
usersRouter.get('/me', authenticateToken, UserController.getCurrentUser)
usersRouter.patch('/me/update', authenticateToken, UserController.updateCurrentUser)

export default usersRouter;