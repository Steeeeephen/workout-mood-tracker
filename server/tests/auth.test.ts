import { afterAll, describe, expect, it } from "vitest";
import { api, cleanupTestUsers, registerUser, testEmail } from "./helpers.ts";

afterAll(cleanupTestUsers);

const register = (password?: unknown) =>
  api()
    .post("/api/auth/register")
    .send({
      first_name: "Test",
      last_name: "User",
      email: testEmail(),
      ...(password === undefined ? {} : { password }),
    });

describe("POST /api/auth/register", () => {
  it("rejects a missing password", async () => {
    const res = await register();
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Password must be at least 8 characters.");
  });

  it("rejects an empty password", async () => {
    const res = await register("");
    expect(res.status).toBe(400);
  });

  it("rejects a password shorter than 8 characters", async () => {
    const res = await register("abc1234");
    expect(res.status).toBe(400);
  });

  it("rejects a non-string password", async () => {
    const res = await register(12345678);
    expect(res.status).toBe(400);
  });

  it("registers a user with a valid password", async () => {
    const res = await register("password123");
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

  it("rejects an empty password", async () => {
    const user = await registerUser();
    const res = await api()
      .post("/api/auth/login")
      .send({ email: user.email, password: "" });

    expect(res.status).toBe(401);
  });
});
