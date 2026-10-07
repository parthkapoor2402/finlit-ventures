import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SummaryScreen } from "@/components/neuplan/SummaryScreen";

describe("SummaryScreen", () => {
  it("shows the app fallback and a failed summary", async () => {
    const person = userEvent.setup();
    let fail = false;
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        if (fail) return new Response(JSON.stringify({ message: "no" }), { status: 500 });
        return new Response(
          JSON.stringify({
            cached: false,
            insight: {
              id: "1",
              source: "fallback",
              text: "Your week is clear, and no needs are open. This note was written by the app from those counts.",
              counts: {},
              cacheKey: "abc",
              generatedAt: "2026-10-07T00:00:00.000Z",
              fallbackReason: "missing_key",
            },
          }),
          { status: 200 },
        );
      }),
    );
    render(<SummaryScreen />);
    await person.click(screen.getByRole("button", { name: "Summarise this week" }));
    expect(await screen.findByText(/Your week is clear/)).toBeInTheDocument();
    expect(screen.getByText("Written by the app")).toBeInTheDocument();
    fail = true;
    await person.click(screen.getByRole("button", { name: "Summarise this week" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("We couldn't write the summary.");
  });
});
