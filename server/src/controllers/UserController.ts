import { prisma } from "../lib/prisma.ts";
import type { Request, Response } from "express";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
      },
    });

    res.json(user);
  } catch (err) {
    console.error("Error in controller:", err);
    res.status(500).json({ message: "Error fetching user" });
  }
};

export const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { first_name, last_name, email } = req.body;

    if (first_name !== undefined && first_name.trim() === "") {
      return res.status(400).json({ error: "First name cannot be empty" });
    }

    if (last_name !== undefined && last_name.trim() === "") {
      return res.status(400).json({ error: "Last name cannot be empty" });
    }

    if (email !== undefined && !emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (email !== undefined) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing && existing.id !== userId) {
        return res.status(409).json({ error: "Email already in use" });
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { first_name, last_name, email },
    });

    res.status(200).json(user);
  } catch (err: any) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "Email already in use" });
    }

    console.error("Error in controller:", err);

    res.status(500).json({ error: "Error updating user" });
  }
};
