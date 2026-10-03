import express from "express";
import * as EntryController from "../controllers/EntryController.ts";
import { authenticateToken } from "../middleware/authMiddleware.ts";
import { validateBody } from "../middleware/validateBody.ts";
import {
  createEntrySchema,
  updateEntrySchema,
} from "../schemas/entrySchemas.ts";

const entriesRouter = express.Router();

entriesRouter.post(
  "/",
  authenticateToken,
  validateBody(createEntrySchema),
  EntryController.createEntry,
);
entriesRouter.get("/", authenticateToken, EntryController.getEntries);
entriesRouter.get(
  "/day/:date",
  authenticateToken,
  EntryController.getEntriesByDate,
);
entriesRouter.get("/:id", authenticateToken, EntryController.getEntry);
entriesRouter.patch(
  "/:id",
  authenticateToken,
  validateBody(updateEntrySchema),
  EntryController.updateEntry,
);
entriesRouter.delete("/:id", authenticateToken, EntryController.deleteEntry);

export default entriesRouter;
