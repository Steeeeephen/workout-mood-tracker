import { prisma } from "../lib/prisma.ts";
import type { Request, Response } from "express";

const editableEntryFields = [
  "entry_type",
  "entry_datetime",
  "mood",
  "content",
  "details",
] as const;

const pickEntryFields = (body: Record<string, unknown>) => {
  const data: Record<string, unknown> = {};

  for (const field of editableEntryFields) {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  }

  return data;
};

export const createEntry = async (req: Request, res: Response) => {
  try {
    const entry = await prisma.entry.create({
      data: {
        ...pickEntryFields(req.body),
        user_id: req.userId,
      } as any,
    });
    res.status(201).json(entry);
  } catch (err: Error | any) {
    console.error("Controller error:", err);
    res.status(500).json({
      error: "Failed to post data",
      message: err.message,
    });
  }
};

export const getEntriesByDate = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { date } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const startOfDay = new Date(date + "T00:00:00.000Z");
    const endOfDay = new Date(date + "T23:59:59.999Z");

    const entries = await prisma.entry.findMany({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: { created_at: "asc" },
    });

    res.status(200).json(entries);
  } catch (err: Error | any) {
    console.error("Error in controller:", err);
    res.status(500).json({
      error: "Failed to fetch data",
      message: err.message,
    });
  }
};

export const getEntries = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const entries = await prisma.entry.findMany({
      where: {
        user_id: userId,
      },
    });
    res.status(200).json(entries);
  } catch (err: Error | any) {
    console.error("Error in controller:", err);
    res.status(500).json({
      error: "Failed to fetch data",
      message: err.message,
    });
  }
};

export const getEntry = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (typeof req.params.id !== "string") {
      return res.status(400).json({ error: "Invalid entry ID" });
    }

    const entryId = parseInt(req.params.id);

    if (isNaN(entryId)) {
      return res.status(400).json({ error: "Invalid entry ID" });
    }

    const entry = await prisma.entry.findFirst({
      where: {
        id: entryId,
        user_id: userId,
      },
    });

    if (!entry) {
      return res.status(404).json({ error: "Entry not found" });
    }

    res.status(200).json(entry);
  } catch (err: Error | any) {
    console.error("Error in controller:", err);
    res.status(500).json({
      error: "Error fetching data",
      message: err.message,
    });
  }
};

export const updateEntry = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (typeof req.params.id !== "string") {
      return res.status(400).json({ error: "Invalid entry ID" });
    }

    const entryId = parseInt(req.params.id);

    if (isNaN(entryId)) {
      return res.status(400).json({ error: "Invalid entry ID" });
    }

    const entry = await prisma.entry.update({
      where: {
        id: entryId,
        user_id: userId,
      },
      data: pickEntryFields(req.body),
    });

    res.status(200).json(entry);
  } catch (err: Error | any) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Entry not found" });
    }

    console.error("Error in controller", err);
    res.status(500).json({
      error: "Error updating data",
      message: err.message,
    });
  }
};

export const deleteEntry = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (typeof req.params.id !== "string") {
      return res.status(400).json({ error: "Invalid entry ID" });
    }

    const entryId = parseInt(req.params.id);

    if (isNaN(entryId)) {
      return res.status(400).json({ error: "Invalid entry ID" });
    }

    const entry = await prisma.entry.findFirst({
      where: {
        id: entryId,
        user_id: userId,
      },
    });

    if (!entry) {
      return res.status(404).json({ error: "Entry not found" });
    }

    await prisma.entry.delete({
      where: { id: entryId },
    });

    res.status(204).send();
  } catch (err: Error | any) {
    console.error("Error in controller", err);
    res.status(500).json({
      error: "Error deleting data",
      message: err.message,
    });
  }
};
