import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { PATCH } from "@/app/api/needs/[id]/route";
import { POST } from "@/app/api/needs/route";

describe("need routes", () => {
  let directory: string;

  beforeEach(async () => {
    directory = await mkdtemp(path.join(os.tmpdir(), "neuplan-needs-"));
    process.env.NEUPLAN_DATA_DIR = directory;
  });

  afterEach(async () => {
    await rm(directory, { recursive: true, force: true });
  });

  it("rejects a Tata stop that is not allowed for the need", async () => {
    const created = await POST(
      new Request("http://localhost/api/needs", {
        method: "POST",
        body: JSON.stringify({ type: "remember", title: "Call home" }),
      }),
    );
    const { need } = (await created.json()) as { need: { id: string } };
    const response = await PATCH(
      new Request("http://localhost/api/needs/" + need.id, {
        method: "PATCH",
        body: JSON.stringify({ state: "resolved", tataDestination: "croma" }),
      }),
      { params: Promise.resolve({ id: need.id }) },
    );
    expect(response.status).toBe(400);
    const body = (await response.json()) as { message: string };
    expect(body.message).toBe("That Tata stop does not fit this need.");
  });
});
