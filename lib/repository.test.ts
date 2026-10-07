import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { RequestError } from "@/lib/errors";
import {
  createItem,
  createNeed,
  deleteItem,
  getUser,
  getWeek,
  recordEvent,
  updateItem,
  updateNeed,
  updateUser,
} from "@/lib/repository";

const NOW = new Date("2026-10-07T12:00:00+05:30");

describe("repository", () => {
  let directory: string;

  beforeEach(async () => {
    directory = await mkdtemp(path.join(os.tmpdir(), "neuplan-"));
    process.env.NEUPLAN_DATA_DIR = directory;
  });

  afterEach(async () => {
    await rm(directory, { recursive: true, force: true });
  });

  it("seeds Ananya as demo data with no college, spend, or week items", async () => {
    const user = await getUser();
    expect(user.displayName).toBe("Ananya");
    expect(user.isDemo).toBe(true);
    expect(user.demoLabel).toBe("DEMO DATA");
    expect(user.livingSituation).toBeNull();
    expect(user.onboardingComplete).toBe(false);
    const week = await getWeek(NOW);
    expect(week.startsOn).toBe("2026-10-05");
    expect(week.items).toEqual([]);
    expect(user).not.toHaveProperty("college");
    expect(user).not.toHaveProperty("spend");
  });

  it("creates, updates, and deletes an item inside the current week", async () => {
    const created = await createItem(
      { type: "study", title: "  Reading block  ", day: "2026-10-08", time: "18:00" },
      NOW,
    );
    expect(created.title).toBe("Reading block");
    expect(created.state).toBe("planned");
    const updated = await updateItem(created.id, { state: "done", title: "Reading" }, NOW);
    expect(updated.state).toBe("done");
    const week = await getWeek(NOW);
    expect(week.items.map((item) => item.title)).toEqual(["Reading"]);
    const removed = await deleteItem(created.id);
    expect(removed.id).toBe(created.id);
    expect((await getWeek(NOW)).items).toEqual([]);
  });

  it("rejects a day outside this week, an empty title, and an unknown Tata stop", async () => {
    await expect(
      createItem({ type: "classes", title: "Class", day: "2026-10-12" }, NOW),
    ).rejects.toBeInstanceOf(RequestError);
    await expect(
      createItem({ type: "classes", title: "   ", day: "2026-10-07" }, NOW),
    ).rejects.toBeInstanceOf(RequestError);
    await expect(
      createItem(
        { type: "shopping", title: "Charger", day: "2026-10-07", tataDestination: "amazon" },
        NOW,
      ),
    ).rejects.toBeInstanceOf(RequestError);
  });

  it("resolves a buy need only to an allowed demo stop", async () => {
    const need = await createNeed({ type: "buy", title: "USB charger" }, NOW);
    await expect(updateNeed(need.id, { state: "resolved", tataDestination: "neu_upi" }, NOW)).rejects.toMatchObject({
      status: 400,
    });
    const notebook = await createNeed({ type: "buy", title: "Notebook" }, NOW);
    await expect(updateNeed(notebook.id, { state: "resolved", tataDestination: "croma" }, NOW)).rejects.toMatchObject({
      status: 400,
    });
    const resolved = await updateNeed(need.id, { state: "resolved", tataDestination: "croma" }, NOW);
    expect(resolved.resolution).toEqual({
      destination: "croma",
      label: "Croma",
      isLive: false,
      demoOnly: true,
    });
  });

  it("does not attach a Tata stop to a remembered need", async () => {
    const need = await createNeed({ type: "remember", title: "Call home" }, NOW);
    await expect(
      updateNeed(need.id, { state: "resolved", tataDestination: "croma" }, NOW),
    ).rejects.toMatchObject({ status: 400 });
    const resolved = await updateNeed(need.id, { state: "resolved" }, NOW);
    expect(resolved.resolution).toBeNull();
    expect(resolved.state).toBe("resolved");
  });

  it("refuses to finish onboarding until the three answers exist", async () => {
    await expect(updateUser({ onboardingComplete: true }, NOW)).rejects.toMatchObject({ status: 400 });
    const user = await updateUser(
      {
        livingSituation: "hostel",
        weekShapes: ["classes", "classes", "study"],
        helpWith: ["see_the_week"],
        onboardingComplete: true,
      },
      NOW,
    );
    expect(user.livingSituation).toBe("hostel");
    expect(user.weekShapes).toEqual(["classes", "study"]);
    expect(user.onboardingComplete).toBe(true);
    expect(user.onboardingCompletedAt).toBe(NOW.toISOString());
  });

  it("rejects an unknown analytics event", async () => {
    await expect(recordEvent("streak_opened", {}, NOW)).rejects.toMatchObject({ status: 400 });
    const event = await recordEvent("week_view_open", { source: "home" }, NOW);
    expect(event.name).toBe("week_view_open");
    expect(event.props).toEqual({ source: "home" });
  });
});
