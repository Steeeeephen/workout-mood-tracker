import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  api,
  cleanupTestUsers,
  registerUser,
  testEmail,
} from "./helpers.ts";

type TestUser = Awaited<ReturnType<typeof registerUser>>;

let user: TestUser;

beforeAll(async () => {
  user = await registerUser();
});

afterAll(cleanupTestUsers);

const updateMe = (body: Record<string, unknown>) =>
  api()
    .patch("/api/users/me/update")
    .set("Authorization", `Bearer ${user.token}`)
    .send(body);

describe("PATCH /api/users/me/update", () => {
  it("updates and trims names", async () => {
    const res = await updateMe({ first_name: "  Updated  " });
    expect(res.status).toBe(200);
    expect(res.body.first_name).toBe("Updated");
  });

  it("rejects a blank first name", async () => {
    const res = await updateMe({ first_name: "   " });
    expect(res.status).toBe(400);
  });

  it("rejects a non-string name instead of crashing", async () => {
    const res = await updateMe({ first_name: 123 });
    expect(res.status).toBe(400);
  });

  it("rejects an invalid email", async () => {
    const res = await updateMe({ email: "not-an-email" });
    expect(res.status).toBe(400);
  });

  it("rejects a new password shorter than 8 characters", async () => {
    const res = await updateMe({ password: "short" });
    expect(res.status).toBe(400);
  });

  it("does not return the password hash", async () => {
    const res = await updateMe({ last_name: "Person" });
    expect(res.status).toBe(200);
    expect(res.body).not.toHaveProperty("password");
  });
});

describe("changing email or password", () => {
  it("requires the current password to change the password", async () => {
    const target = await registerUser();
    const res = await api()
      .patch("/api/users/me/update")
      .set("Authorization", `Bearer ${target.token}`)
      .send({ password: "new-password-123" });

    expect(res.status).toBe(400);
  });

  it("rejects an incorrect current password", async () => {
    const target = await registerUser();
    const res = await api()
      .patch("/api/users/me/update")
      .set("Authorization", `Bearer ${target.token}`)
      .send({ password: "new-password-123", current_password: "wrong-one" });

    expect(res.status).toBe(403);
  });

  it("changes the password with the correct current password", async () => {
    const target = await registerUser();
    const res = await api()
      .patch("/api/users/me/update")
      .set("Authorization", `Bearer ${target.token}`)
      .send({
        password: "new-password-123",
        current_password: target.password,
      });

    expect(res.status).toBe(200);

    const oldLogin = await api()
      .post("/api/auth/login")
      .send({ email: target.email, password: target.password });
    expect(oldLogin.status).toBe(401);

    const newLogin = await api()
      .post("/api/auth/login")
      .send({ email: target.email, password: "new-password-123" });
    expect(newLogin.status).toBe(200);
  });

  it("requires the current password to change the email", async () => {
    const target = await registerUser();
    const res = await api()
      .patch("/api/users/me/update")
      .set("Authorization", `Bearer ${target.token}`)
      .send({ email: testEmail() });

    expect(res.status).toBe(400);
  });

  it("changes the email with the correct current password", async () => {
    const target = await registerUser();
    const newEmail = testEmail();
    const res = await api()
      .patch("/api/users/me/update")
      .set("Authorization", `Bearer ${target.token}`)
      .send({ email: newEmail, current_password: target.password });

    expect(res.status).toBe(200);
    expect(res.body.email).toBe(newEmail);
  });

  it("does not require the current password when the email only differs in case", async () => {
    const target = await registerUser();
    const res = await api()
      .patch("/api/users/me/update")
      .set("Authorization", `Bearer ${target.token}`)
      .send({ first_name: "Same", email: target.email.toUpperCase() });

    expect(res.status).toBe(200);
    expect(res.body.email).toBe(target.email);
  });

  it("rejects an email already used by another account, in any case", async () => {
    const target = await registerUser();
    const taken = await registerUser();
    const res = await api()
      .patch("/api/users/me/update")
      .set("Authorization", `Bearer ${target.token}`)
      .send({
        email: taken.email.toUpperCase(),
        current_password: target.password,
      });

    expect(res.status).toBe(409);
  });
});
