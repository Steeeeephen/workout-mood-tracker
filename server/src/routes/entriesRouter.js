import express from "express";
import * as EntryController from "../controllers/EntryController.js"

const entriesRouter = express.Router();

entriesRouter.post('/', EntryController.createEntry);
entriesRouter.get('/date/:date', EntryController.getEntriesByDate);
entriesRouter.get('/:id', EntryController.getEntry);
entriesRouter.patch('/:id/update', EntryController.updateEntry);
entriesRouter.delete('/:id/delete', EntryController.deleteEntry)

export default entriesRouter;