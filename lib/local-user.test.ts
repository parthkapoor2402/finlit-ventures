import { beforeEach, describe, expect, it } from "vitest";
import { clearDraft, readDraft, writeDraft } from "@/lib/local-user";

describe("onboarding draft", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("restores the step and the answers after they are written", () => {
    writeDraft({
      step: 2,
      weekShapes: ["classes", "study"],
      livingSituation: null,
      helpWith: [],
    });
    expect(readDraft()).toEqual({
      step: 2,
      weekShapes: ["classes", "study"],
      livingSituation: null,
      helpWith: [],
    });
    clearDraft();
    expect(readDraft().step).toBe(1);
  });

  it("ignores a broken draft", () => {
    localStorage.setItem("neuplan.draft", "{");
    expect(readDraft().weekShapes).toEqual([]);
  });
});
