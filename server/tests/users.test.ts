import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { api, cleanupTestUsers, registerUser } from "./helpers.ts";

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
