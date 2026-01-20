import express from "express";
import * as EntryController from "../controllers/EntryController.js"
import { authenticateToken } from "../middleware/authMiddleware.js";

const entriesRouter = express.Router();

entriesRouter.post('/', authenticateToken, EntryController.createEntry);
entriesRouter.get('/date/:date', authenticateToken, EntryController.getEntriesByDate);
entriesRouter.get('/:id', authenticateToken, EntryController.getEntry);
entriesRouter.patch('/:id/update', authenticateToken, EntryController.updateEntry);
entriesRouter.delete('/:id/delete', authenticateToken, EntryController.deleteEntry)

export default entriesRouter;