import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { api, cleanupTestUsers, registerUser } from "./helpers.ts";

type TestUser = Awaited<ReturnType<typeof registerUser>>;

let owner: TestUser;
let other: TestUser;

beforeAll(async () => {
  owner = await registerUser();
  other = await registerUser();
});

afterAll(cleanupTestUsers);

const createEntry = (user: TestUser, body: Record<string, unknown> = {}) =>
  api()
    .post("/api/entries")
    .set("Authorization", `Bearer ${user.token}`)
    .send({
      entry_type: "WORKOUT",
      entry_datetime: new Date().toISOString(),
      mood: 4,
      content: "test entry",
      ...body,
    });

describe("POST /api/entries", () => {
  it("saves the allowed fields", async () => {
    const res = await createEntry(owner);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      entry_type: "WORKOUT",
      mood: 4,
      content: "test entry",
      user_id: owner.id,
    });
  });

  it("ignores user_id, id and created_at in the body", async () => {
    const res = await createEntry(owner, {
      user_id: other.id,
      id: 999999,
      created_at: "2000-01-01T00:00:00.000Z",
    });

    expect(res.status).toBe(201);
    expect(res.body.user_id).toBe(owner.id);
    expect(res.body.id).not.toBe(999999);
    expect(res.body.created_at).not.toMatch(/^2000/);
  });
});

describe("PATCH /api/entries/:id", () => {
  it("updates allowed fields and ignores protected ones", async () => {
    const { body: entry } = await createEntry(owner);

    const res = await api()
      .patch(`/api/entries/${entry.id}`)
      .set("Authorization", `Bearer ${owner.token}`)
      .send({
        mood: 2,
        user_id: other.id,
        created_at: "2000-01-01T00:00:00.000Z",
      });

    expect(res.status).toBe(200);
    expect(res.body.mood).toBe(2);
    expect(res.body.user_id).toBe(owner.id);
    expect(res.body.created_at).toBe(entry.created_at);
  });

  it("returns 404 for another user's entry and leaves it unchanged", async () => {
    const { body: entry } = await createEntry(owner);

    const res = await api()
      .patch(`/api/entries/${entry.id}`)
      .set("Authorization", `Bearer ${other.token}`)
      .send({ mood: 1 });

    expect(res.status).toBe(404);

    const check = await api()
      .get(`/api/entries/${entry.id}`)
      .set("Authorization", `Bearer ${owner.token}`);
    expect(check.body.mood).toBe(4);
  });

  it("returns 404 for an entry that does not exist", async () => {
    const res = await api()
      .patch("/api/entries/2147483000")
      .set("Authorization", `Bearer ${owner.token}`)
      .send({ mood: 1 });

    expect(res.status).toBe(404);
  });
});

describe("GET /api/entries", () => {
  it("does not include other users' entries", async () => {
    const { body: entry } = await createEntry(owner);

    const res = await api()
      .get("/api/entries")
      .set("Authorization", `Bearer ${other.token}`);

    expect(res.status).toBe(200);
    expect(res.body.map((e: { id: number }) => e.id)).not.toContain(entry.id);
  });
});

describe("DELETE /api/entries/:id", () => {
  it("returns 404 for another user's entry", async () => {
    const { body: entry } = await createEntry(owner);

    const res = await api()
      .delete(`/api/entries/${entry.id}`)
      .set("Authorization", `Bearer ${other.token}`);

    expect(res.status).toBe(404);
  });

  it("deletes the user's own entry", async () => {
    const { body: entry } = await createEntry(owner);

    const res = await api()
      .delete(`/api/entries/${entry.id}`)
      .set("Authorization", `Bearer ${owner.token}`);

    expect(res.status).toBe(204);
  });
});
