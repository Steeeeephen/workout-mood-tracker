import { prisma } from "./prisma.ts";

// Older accounts may have mixed-case emails, while new ones are stored
// lowercase. Prefer an exact match, then fall back to a case-insensitive one.
export const findUserByEmail = async (email: string) =>
  (await prisma.user.findUnique({ where: { email } })) ??
  (await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    orderBy: { id: "asc" },
  }));
