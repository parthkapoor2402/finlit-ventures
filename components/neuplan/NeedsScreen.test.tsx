import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NeedsScreen } from "@/components/neuplan/NeedsScreen";
import type { Need } from "@/lib/types";

const needs: Need[] = [
  {
    id: "buy-1",
    type: "buy",
    title: "Notebook",
    day: null,
    time: null,
    state: "open",
    resolution: null,
    source: "user",
    createdAt: "2026-10-07T00:00:00.000Z",
    updatedAt: "2026-10-07T00:00:00.000Z",
  },
  {
    id: "remember-1",
    type: "remember",
    title: "Call home",
    day: null,
    time: null,
    state: "open",
    resolution: null,
    source: "user",
    createdAt: "2026-10-07T00:00:01.000Z",
    updatedAt: "2026-10-07T00:00:01.000Z",
  },
];

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("NeedsScreen", () => {
  it("offers only allowed demo stops for each need", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ needs }), { status: 200 })),
    );
    render(<NeedsScreen />);
    expect(await screen.findByText("Notebook")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Croma" })).toBeNull();
    expect(screen.queryByRole("button", { name: "BigBasket" })).toBeNull();
    const remembered = screen.getByText("Call home").closest("li");
    expect(remembered).toBeTruthy();
    expect(remembered?.textContent).not.toContain("Croma");
    expect(screen.getByText("Notebook").closest("li")?.textContent).not.toContain("Croma");
  });
});
