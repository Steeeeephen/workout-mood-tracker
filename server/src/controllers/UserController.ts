import { prisma } from "../lib/prisma.ts";
import type { Request, Response } from "express";

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
  const userId = 2;
  const { first_name, last_name, email, password } = req.body;
  const user = await prisma.user.update({
    where: { id: userId },
    data: { first_name, last_name, email, password },
  });
  res.status(200).json(user);
};
