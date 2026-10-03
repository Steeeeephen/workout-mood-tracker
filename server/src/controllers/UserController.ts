import { prisma } from "../lib/prisma.ts";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { findUserByEmail } from "../lib/findUserByEmail.ts";
import type { UpdateUserInput } from "../schemas/userSchemas.ts";

const saltRounds = 10;

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

export const updateCurrentUser = async (
  req: Request<{}, any, UpdateUserInput>,
  res: Response,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { first_name, last_name, email, password, current_password } =
      req.body;

    const currentUser = await prisma.user.findUnique({ where: { id: userId } });

    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // The schema lowercases email, so compare against the stored one the same
    // way. An unchanged email (in any case) is left as stored.
    const newEmail =
      email !== undefined && email !== currentUser.email.toLowerCase()
        ? email
        : undefined;

    if (newEmail || password) {
      if (!current_password) {
        return res.status(400).json({
          error: "Current password is required to change email or password",
        });
      }

      const isPasswordValid = await bcrypt.compare(
        current_password,
        currentUser.password,
      );

      if (!isPasswordValid) {
        return res.status(403).json({ error: "Current password is incorrect" });
      }
    }

    if (newEmail) {
      const existing = await findUserByEmail(newEmail);
      if (existing && existing.id !== userId) {
        return res.status(409).json({ error: "Email already in use" });
      }
    }

    const data: Record<string, unknown> = { first_name, last_name };

    if (newEmail) {
      data.email = newEmail;
    }

    if (password) {
      data.password = await bcrypt.hash(password, saltRounds);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        created_at: true,
        updated_at: true,
      },
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
