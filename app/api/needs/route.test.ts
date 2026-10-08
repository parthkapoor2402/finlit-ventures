import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { PATCH } from "@/app/api/needs/[id]/route";
import { GET, POST } from "@/app/api/needs/route";
import { resolveNeed } from "@/lib/tata/resolutionEngine";
import type { Need } from "@/lib/types";

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

  it("splits the Mumbai sentence into three needs and leaves the others open when the flight is done", async () => {
    const created = await POST(
      new Request("http://localhost/api/needs", {
        method: "POST",
        body: JSON.stringify({
          type: "replace",
          title: "I'm travelling to Mumbai this weekend. I need a flight, a charger, some clothes",
        }),
      }),
    );
    expect(created.status).toBe(201);
    const saved = (await created.json()) as { decomposed?: boolean; source?: string; needs?: Need[] };
    expect(saved.decomposed).toBe(true);
    expect(saved.source).toBe("fallback");
    expect(saved.needs?.map((need) => [need.title, need.type, resolveNeed(need.type, need.title)?.label])).toEqual([
      ["Flight", "book", "Air India"],
      ["Charger", "buy", "Croma"],
      ["Clothes", "buy", "Westside"],
    ]);
    expect(saved.needs?.some((need) => need.title.includes("travelling"))).toBe(false);

    const flight = saved.needs?.find((need) => need.title === "Flight");
    const done = await PATCH(
      new Request("http://localhost/api/needs/" + flight?.id, {
        method: "PATCH",
        body: JSON.stringify({ state: "resolved", tataDestination: null }),
      }),
      { params: Promise.resolve({ id: flight?.id ?? "" }) },
    );
    expect(done.status).toBe(200);
    const listed = (await (await GET()).json()) as { needs: Need[] };
    const byTitle = Object.fromEntries(listed.needs.map((need) => [need.title, need.state]));
    expect(byTitle).toMatchObject({ Flight: "resolved", Charger: "open", Clothes: "open" });
  });

  it("saves each tested sentence as its own needs", async () => {
    const cases: { title: string; type: string; decomposed: boolean; lines: string[][] }[] = [
      {
        title: "I'm travelling to Mumbai this weekend. I need a flight, a charger, some clothes and a hotel",
        type: "replace",
        decomposed: true,
        lines: [
          ["Flight", "book", "Air India"],
          ["Charger", "buy", "Croma"],
          ["Clothes", "buy", "Westside"],
          ["Hotel", "book", "Taj"],
        ],
      },
      {
        title: "My sister's birthday is next week. I need a dress, a watch and a gift.",
        type: "replace",
        decomposed: true,
        lines: [
          ["Dress", "buy", "Westside"],
          ["Watch", "buy", "Titan"],
          ["Gift", "buy", "Westside"],
        ],
      },
      {
        title: "I need to buy a charger today.",
        type: "replace",
        decomposed: false,
        lines: [["Charger", "buy", "Croma"]],
      },
      {
        title: "I need to replace my old charger.",
        type: "buy",
        decomposed: false,
        lines: [["Replace charger", "replace", "Croma"]],
      },
      {
        title: "I need a flight and a hotel for Mumbai.",
        type: "replace",
        decomposed: true,
        lines: [
          ["Flight", "book", "Air India"],
          ["Hotel", "book", "Taj"],
        ],
      },
    ];

    for (const sample of cases) {
      const created = await POST(
        new Request("http://localhost/api/needs", {
          method: "POST",
          body: JSON.stringify({ type: sample.type, title: sample.title }),
        }),
      );
      expect(created.status).toBe(201);
      const saved = (await created.json()) as { decomposed?: boolean; needs?: Need[]; need?: Need };
      expect(saved.decomposed).toBe(sample.decomposed);
      const needs = saved.needs ?? (saved.need ? [saved.need] : []);
      expect(needs.map((need) => [need.title, need.type, resolveNeed(need.type, need.title)?.label])).toEqual(
        sample.lines,
      );
      expect(needs.some((need) => need.title === sample.title)).toBe(false);
    }
  });
});
