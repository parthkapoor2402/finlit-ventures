import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { WeekScreen } from "@/components/neuplan/WeekScreen";
import type { User, Week } from "@/lib/types";

const user: User = {
  id: "demo-ananya",
  displayName: "Ananya",
  isDemo: true,
  demoLabel: "DEMO DATA",
  livingSituation: "hostel",
  weekShapes: ["study"],
  helpWith: ["see_the_week"],
  onboardingComplete: true,
  onboardingCompletedAt: "2026-10-07T00:00:00.000Z",
};

const emptyWeek: Week = {
  id: "week-2026-10-05",
  startsOn: "2026-10-05",
  endsOn: "2026-10-11",
  timeZone: "Asia/Kolkata",
  days: ["2026-10-05", "2026-10-06", "2026-10-07", "2026-10-08", "2026-10-09", "2026-10-10", "2026-10-11"],
  items: [],
};

describe("WeekScreen", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("shows the clear week and posts a new item", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.endsWith("/api/week") && (!init || init.method === undefined)) {
        return new Response(JSON.stringify({ week: emptyWeek }), { status: 200 });
      }
      return new Response(JSON.stringify({ item: { id: "1" } }), { status: 201 });
    });
    vi.stubGlobal("fetch", fetchMock);
    const person = userEvent.setup();
    render(<WeekScreen user={user} />);
    expect(await screen.findByText("Your week is clear.")).toBeInTheDocument();
    await person.type(screen.getByLabelText("Title"), "Reading block");
    await person.click(screen.getByRole("button", { name: "Add something" }));
    const post = fetchMock.mock.calls.find((call) => {
      const init = call[1] as RequestInit | undefined;
      return init?.method === "POST";
    });
    expect(post).toBeTruthy();
    const body = JSON.parse(String((post?.[1] as RequestInit).body)) as { title: string; type: string };
    expect(body.title).toBe("Reading block");
    expect(body.type).toBe("personal");
  });

  it("shows the refresh error and tries again", async () => {
    let fail = true;
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        if (fail) return new Response(JSON.stringify({ message: "no" }), { status: 500 });
        return new Response(JSON.stringify({ week: emptyWeek }), { status: 200 });
      }),
    );
    const person = userEvent.setup();
    render(<WeekScreen user={user} />);
    expect(await screen.findByRole("alert")).toHaveTextContent("We couldn't refresh your week.");
    fail = false;
    await person.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findByText("Your week is clear.")).toBeInTheDocument();
  });
});
