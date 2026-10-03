import request from "supertest";
import app from "../src/app.ts";
import { prisma } from "../src/lib/prisma.ts";

// Tests run against the database in DATABASE_URL. Every test user gets an
// email under this prefix so cleanup only ever touches test data.
export const testEmailPrefix = `vitest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

let counter = 0;

export const testEmail = () =>
  `${testEmailPrefix}-${++counter}@example.com`;

export const api = () => request(app);

export const registerUser = async (password = "password123") => {
  const email = testEmail();
  const res = await api()
    .post("/api/auth/register")
    .send({ first_name: "Test", last_name: "User", email, password });

  if (res.status !== 201) {
    throw new Error(`Failed to register test user: ${res.status}`);
  }

  return {
    id: res.body.userId as number,
    token: res.body.token as string,
    email,
    password,
  };
};

export const cleanupTestUsers = async () => {
  const where = { email: { startsWith: testEmailPrefix } };
  await prisma.entry.deleteMany({ where: { user: where } });
  await prisma.user.deleteMany({ where });
  await prisma.$disconnect();
};
