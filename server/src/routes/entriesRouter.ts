import express from "express";
import * as EntryController from "../controllers/EntryController.ts";
import { authenticateToken } from "../middleware/authMiddleware.ts";

const entriesRouter = express.Router();

entriesRouter.post("/", authenticateToken, EntryController.createEntry);
entriesRouter.get("/", authenticateToken, EntryController.getEntries);
entriesRouter.get(
  "/day/:date",
  authenticateToken,
  EntryController.getEntriesByDate,
);
entriesRouter.get("/:id", authenticateToken, EntryController.getEntry);
entriesRouter.patch("/:id", authenticateToken, EntryController.updateEntry);
entriesRouter.delete("/:id", authenticateToken, EntryController.deleteEntry);

export default entriesRouter;
