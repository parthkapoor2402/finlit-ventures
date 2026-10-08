import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { GET, PUT } from "@/app/api/user/route";

describe("/api/user", () => {
  let directory: string;

  beforeEach(async () => {
    directory = await mkdtemp(path.join(os.tmpdir(), "neuplan-user-"));
    process.env.NEUPLAN_DATA_DIR = directory;
  });

  afterEach(async () => {
    await rm(directory, { recursive: true, force: true });
  });

  it("saves onboarding and reads it back", async () => {
    const denied = await PUT(
      new Request("http://localhost/api/user", {
        method: "PUT",
        body: JSON.stringify({ onboardingComplete: true }),
      }),
    );
    expect(denied.status).toBe(400);

    const saved = await PUT(
      new Request("http://localhost/api/user", {
        method: "PUT",
        body: JSON.stringify({
          livingSituation: "hostel",
          weekShapes: ["classes"],
          helpWith: ["see_the_week"],
          onboardingComplete: true,
        }),
      }),
    );
    expect(saved.status).toBe(200);
    const again = await GET();
    const body = (await again.json()) as { user: { livingSituation: string; onboardingComplete: boolean } };
    expect(body.user.livingSituation).toBe("hostel");
    expect(body.user.onboardingComplete).toBe(true);
  });
});
