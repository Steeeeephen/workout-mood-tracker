import { afterAll, describe, expect, it } from "vitest";
import jwt from "jsonwebtoken";
import { api, cleanupTestUsers, registerUser } from "./helpers.ts";

afterAll(cleanupTestUsers);

const getMe = (token: string) =>
  api().get("/api/users/me").set("Authorization", `Bearer ${token}`);

describe("token validation", () => {
  it("returns 401 for a malformed token", async () => {
    const res = await getMe("not-a-real-token");
    expect(res.status).toBe(401);
  });

  it("returns 401 for an expired token", async () => {
    const user = await registerUser();
    const expired = jwt.sign(
      { userId: user.id, tokenVersion: 0 },
      process.env.JWT_SECRET!,
      { expiresIn: -10 },
    );

    const res = await getMe(expired);
    expect(res.status).toBe(401);
  });

  it("returns 401 for a token signed with another secret", async () => {
    const user = await registerUser();
    const forged = jwt.sign(
      { userId: user.id, tokenVersion: 0 },
      "some-other-secret",
    );

    const res = await getMe(forged);
    expect(res.status).toBe(401);
  });

  it("still accepts tokens issued before versioning existed", async () => {
    const user = await registerUser();
    const legacy = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    const res = await getMe(legacy);
    expect(res.status).toBe(200);
  });
});

describe("revoking sessions", () => {
  it("revokes old tokens on password change and returns a working new one", async () => {
    const user = await registerUser();

    const login = await api()
      .post("/api/auth/login")
      .send({ email: user.email, password: user.password });
    const otherDeviceToken = login.body.token as string;

    const res = await api()
      .patch("/api/users/me/update")
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        password: "new-password-123",
        current_password: user.password,
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body).not.toHaveProperty("token_version");

    expect((await getMe(user.token)).status).toBe(401);
    expect((await getMe(otherDeviceToken)).status).toBe(401);
    expect((await getMe(res.body.token)).status).toBe(200);
  });

  it("does not revoke tokens or return a new one for other profile changes", async () => {
    const user = await registerUser();

    const res = await api()
      .patch("/api/users/me/update")
      .set("Authorization", `Bearer ${user.token}`)
      .send({ first_name: "Renamed" });

    expect(res.status).toBe(200);
    expect(res.body).not.toHaveProperty("token");
    expect((await getMe(user.token)).status).toBe(200);
  });

  it("logs out of all devices", async () => {
    const user = await registerUser();

    const login = await api()
      .post("/api/auth/login")
      .send({ email: user.email, password: user.password });
    const otherDeviceToken = login.body.token as string;

    const res = await api()
      .post("/api/auth/logout-all")
      .set("Authorization", `Bearer ${user.token}`);
    expect(res.status).toBe(200);

    expect((await getMe(user.token)).status).toBe(401);
    expect((await getMe(otherDeviceToken)).status).toBe(401);

    const relogin = await api()
      .post("/api/auth/login")
      .send({ email: user.email, password: user.password });
    expect((await getMe(relogin.body.token)).status).toBe(200);
  });

  it("requires a valid token to log out of all devices", async () => {
    const res = await api().post("/api/auth/logout-all");
    expect(res.status).toBe(401);
  });
});
