import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CommandCenter } from "@/components/neuplan/CommandCenter";
import type { User, Week } from "@/lib/types";

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

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status });
}

describe("CommandCenter", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("shows a calm empty week instead of a timetable", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.endsWith("/api/week")) return json({ week: emptyWeek });
        if (url.endsWith("/api/needs")) return json({ needs: [] });
        if (url.endsWith("/api/moments")) return json({ moments: [] });
        if (url.endsWith("/api/notices")) return json({ notices: [] });
        return json({ returning: false });
      }),
    );
    render(<CommandCenter user={user} />);
    expect(await screen.findByText("Nothing is waiting on you.")).toBeInTheDocument();
    expect(screen.queryByText("Your week is clear.")).toBeNull();
    expect(screen.queryByText(/\+15%/)).toBeNull();
    expect(screen.queryByText(/Youth WAU/)).toBeNull();
  });

  it("shows the refresh error and tries again", async () => {
    let fail = true;
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        if (fail) return json({ message: "no" }, 500);
        const url = String(input);
        if (url.endsWith("/api/week")) return json({ week: emptyWeek });
        if (url.endsWith("/api/needs")) return json({ needs: [] });
        if (url.endsWith("/api/moments")) return json({ moments: [] });
        if (url.endsWith("/api/notices")) return json({ notices: [] });
        return json({ returning: false });
      }),
    );
    const person = userEvent.setup();
    render(<CommandCenter user={user} />);
    expect(await screen.findByRole("alert")).toHaveTextContent("We could not refresh what is open.");
    fail = false;
    await person.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findByText("Nothing is waiting on you.")).toBeInTheDocument();
  });
});
