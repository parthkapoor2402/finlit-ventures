import { describe, expect, it, vi } from "vitest";
import { acceptSummary } from "@/lib/ai/accept";
import { fallbackSummary } from "@/lib/ai/fallback";
import { GeminiError } from "@/lib/ai/gemini";
import { buildPrompt } from "@/lib/ai/prompts";
import { composeSummary } from "@/lib/ai/summary";
import { buildCounts } from "@/lib/ai/counts";
import type { User, Week, WeeklyCounts } from "@/lib/types";

const user: User = {
  id: "demo-ananya",
  displayName: "Ananya",
  isDemo: true,
  demoLabel: "DEMO DATA",
  livingSituation: "hostel",
  weekShapes: ["study"],
  helpWith: ["see_the_week"],
  note: null,
  lastSeenAt: null,
  onboardingComplete: true,
  onboardingCompletedAt: null,
};

const week: Week = {
  id: "week-2026-10-05",
  startsOn: "2026-10-05",
  endsOn: "2026-10-11",
  timeZone: "Asia/Kolkata",
  days: ["2026-10-05", "2026-10-06", "2026-10-07", "2026-10-08", "2026-10-09", "2026-10-10", "2026-10-11"],
  items: [
    {
      id: "item-1",
      type: "study",
      title: "Secret reading title",
      day: "2026-10-07",
      time: "18:00",
      state: "planned",
      tataDestination: null,
      source: "user",
      createdAt: "2026-10-07T00:00:00.000Z",
      updatedAt: "2026-10-07T00:00:00.000Z",
    },
  ],
};

const now = new Date("2026-10-07T12:00:00.000Z");

function counts(): WeeklyCounts {
  return buildCounts(user, week, []);
}

describe("weekly summary", () => {
  it("does not put item titles into the counts or the prompt", () => {
    const prompt = buildPrompt(counts());
    expect(prompt).not.toContain("Secret reading title");
    expect(prompt).toContain("Do not invent events");
    expect(prompt).toContain("hostel");
  });

  it("uses the app text when the model is not called", async () => {
    const generate = vi.fn(async () => {
      throw new GeminiError("missing_key");
    });
    const result = await composeSummary({ counts: counts(), cached: null, now, generate });
    expect(result.insight.source).toBe("fallback");
    expect(result.insight.fallbackReason).toBe("missing_key");
    expect(result.insight.text).toBe(fallbackSummary(counts()));
    expect(result.insight.text).not.toMatch(/₹|%/);
  });

  it("uses the app text on timeout and on a price-like reply", async () => {
    const timeout = await composeSummary({
      counts: counts(),
      cached: null,
      now,
      generate: async () => {
        throw new GeminiError("timeout");
      },
    });
    expect(timeout.insight.fallbackReason).toBe("timeout");

    const malformed = await composeSummary({
      counts: counts(),
      cached: null,
      now,
      generate: async () => "Buy this at ₹79999 before stock runs out.",
    });
    expect(malformed.insight.source).toBe("fallback");
    expect(malformed.insight.fallbackReason).toBe("malformed");
    expect(malformed.insight.text).not.toContain("79999");
  });

  it("keeps an accepted model reply and does not call the model again for the same counts", async () => {
    const generate = vi.fn(async () => "This week has 1 planned item and 0 done.");
    const first = await composeSummary({ counts: counts(), cached: null, now, generate });
    expect(first.insight.source).toBe("gemini");
    expect(first.cached).toBe(false);
    expect(acceptSummary(first.insight.text, counts())).toBe(true);

    const second = await composeSummary({
      counts: counts(),
      cached: first.insight,
      now,
      generate,
    });
    expect(second.cached).toBe(true);
    expect(second.insight).toBe(first.insight);
    expect(generate).toHaveBeenCalledTimes(1);
  });

  it("rejects a reply whose number is not in the counts", () => {
    expect(acceptSummary("This week has 1 planned item.", counts())).toBe(true);
    expect(acceptSummary("This week has 40 planned items.", counts())).toBe(false);
  });
});
