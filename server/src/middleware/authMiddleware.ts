import { prisma } from "../lib/prisma.ts";
import { verifyToken, type TokenPayload } from "../lib/token.ts";
import type { NextFunction } from "express";
import type { Request, Response } from "express";

// Every auth failure is a 401 so the client can treat it as "log in again".
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  let decoded: TokenPayload;

  try {
    decoded = verifyToken(token);
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { token_version: true },
    });

    if (!user) {
      return res.status(401).json({ error: "User no longer exists" });
    }

    if ((decoded.tokenVersion ?? 0) !== user.token_version) {
      return res.status(401).json({ message: "Session has been revoked." });
    }

    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error("Error in auth middleware:", err);
    return res.status(500).json({ message: "Error authenticating request." });
  }
};
