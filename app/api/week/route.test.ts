import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { GET } from "@/app/api/week/route";

describe("GET /api/week", () => {
  let directory: string;

  beforeEach(async () => {
    directory = await mkdtemp(path.join(os.tmpdir(), "neuplan-api-"));
    process.env.NEUPLAN_DATA_DIR = directory;
  });

  afterEach(async () => {
    await rm(directory, { recursive: true, force: true });
  });

  it("returns an empty current week from the repository", async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    const body = (await response.json()) as { week: { items: unknown[]; timeZone: string } };
    expect(body.week.items).toEqual([]);
    expect(body.week.timeZone).toBe("Asia/Kolkata");
  });
});
