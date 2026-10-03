import { afterAll, describe, expect, it } from "vitest";
import { api, cleanupTestUsers, registerUser, testEmail } from "./helpers.ts";

afterAll(cleanupTestUsers);

const register = (overrides: Record<string, unknown> = {}) =>
  api()
    .post("/api/auth/register")
    .send({
      first_name: "Test",
      last_name: "User",
      email: testEmail(),
      password: "password123",
      ...overrides,
    });

const issueFields = (body: { issues?: { field: string }[] }) =>
  (body.issues ?? []).map((issue) => issue.field);

describe("POST /api/auth/register", () => {
  it("rejects a missing password", async () => {
    const res = await register({ password: undefined });
    expect(res.status).toBe(400);
    expect(issueFields(res.body)).toContain("password");
  });

  it("rejects an empty password", async () => {
    const res = await register({ password: "" });
    expect(res.status).toBe(400);
  });

  it("rejects a password shorter than 8 characters", async () => {
    const res = await register({ password: "abc1234" });
    expect(res.status).toBe(400);
    expect(res.body.issues).toContainEqual({
      field: "password",
      message: "Password must be at least 8 characters.",
    });
  });

  it("rejects a password longer than 72 characters", async () => {
    const res = await register({ password: "a".repeat(73) });
    expect(res.status).toBe(400);
  });

  it("rejects a non-string password", async () => {
    const res = await register({ password: 12345678 });
    expect(res.status).toBe(400);
  });

  it("rejects an invalid email", async () => {
    const res = await register({ email: "not-an-email" });
    expect(res.status).toBe(400);
    expect(issueFields(res.body)).toContain("email");
  });

  it("rejects missing or blank names", async () => {
    const res = await register({ first_name: undefined, last_name: "   " });
    expect(res.status).toBe(400);
    expect(issueFields(res.body)).toEqual(
      expect.arrayContaining(["first_name", "last_name"]),
    );
  });

  it("registers a user with valid details", async () => {
    const res = await register();
    expect(res.status).toBe(201);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body).not.toHaveProperty("password");
  });
});

describe("POST /api/auth/login", () => {
  it("logs in with the correct password", async () => {
    const user = await registerUser();
    const res = await api()
      .post("/api/auth/login")
      .send({ email: user.email, password: user.password });

    expect(res.status).toBe(200);
    expect(res.body.token).toEqual(expect.any(String));
  });

  it("rejects a wrong password", async () => {
    const user = await registerUser();
    const res = await api()
      .post("/api/auth/login")
      .send({ email: user.email, password: "wrong-password" });

    expect(res.status).toBe(401);
  });

  it("rejects an empty password", async () => {
    const user = await registerUser();
    const res = await api()
      .post("/api/auth/login")
      .send({ email: user.email, password: "" });

    expect(res.status).toBe(400);
  });

  it("rejects a missing password instead of crashing", async () => {
    const user = await registerUser();
    const res = await api().post("/api/auth/login").send({ email: user.email });

    expect(res.status).toBe(400);
  });
});
