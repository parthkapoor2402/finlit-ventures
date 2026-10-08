import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DELETE, PATCH } from "@/app/api/week/items/[id]/route";
import { POST } from "@/app/api/week/items/route";
import { GET } from "@/app/api/week/route";

const NOW = new Date("2026-10-07T12:00:00+05:30");

describe("week item routes", () => {
  let directory: string;

  beforeEach(async () => {
    directory = await mkdtemp(path.join(os.tmpdir(), "neuplan-items-"));
    process.env.NEUPLAN_DATA_DIR = directory;
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(NOW);
  });

  afterEach(async () => {
    vi.useRealTimers();
    await rm(directory, { recursive: true, force: true });
  });

  it("creates, completes, and deletes an item", async () => {
    const created = await POST(
      new Request("http://localhost/api/week/items", {
        method: "POST",
        body: JSON.stringify({ type: "study", title: "Reading block", day: "2026-10-08", time: "18:00" }),
      }),
    );
    expect(created.status).toBe(201);
    const { item } = (await created.json()) as { item: { id: string; state: string } };
    const patched = await PATCH(
      new Request("http://localhost/api/week/items/" + item.id, {
        method: "PATCH",
        body: JSON.stringify({ state: "done", title: "Reading" }),
      }),
      { params: Promise.resolve({ id: item.id }) },
    );
    expect(patched.status).toBe(200);
    const week = await GET();
    const body = (await week.json()) as { week: { items: { title: string; state: string }[] } };
    expect(body.week.items.map((entry) => ({ title: entry.title, state: entry.state }))).toEqual([
      { title: "Reading", state: "done" },
    ]);
    const removed = await DELETE(new Request("http://localhost/api/week/items/" + item.id), {
      params: Promise.resolve({ id: item.id }),
    });
    expect(removed.status).toBe(200);
  });

  it("rejects a day outside this week", async () => {
    const response = await POST(
      new Request("http://localhost/api/week/items", {
        method: "POST",
        body: JSON.stringify({ type: "classes", title: "Class", day: "2026-11-01" }),
      }),
    );
    expect(response.status).toBe(400);
  });
});
