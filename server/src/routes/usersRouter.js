import express from 'express';
import * as UserController from "../controllers/UserController.js";


const usersRouter = express.Router();


usersRouter.post('/', UserController.createUser)
usersRouter.get('/me', UserController.getCurrentUser)
usersRouter.patch('/me/update', UserController.updateCurrentUser)

export default usersRouter;