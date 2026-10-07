import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NeedsScreen } from "@/components/neuplan/NeedsScreen";
import type { Need } from "@/lib/types";

const needs: Need[] = [
  {
    id: "buy-1",
    type: "buy",
    title: "Notebook",
    state: "open",
    resolution: null,
    createdAt: "2026-10-07T00:00:00.000Z",
    updatedAt: "2026-10-07T00:00:00.000Z",
  },
  {
    id: "remember-1",
    type: "remember",
    title: "Call home",
    state: "open",
    resolution: null,
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
    expect(await screen.findByRole("button", { name: "Croma" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Westside" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "BigBasket" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Neu UPI" })).toBeNull();
    expect(screen.queryByRole("button", { name: "IHCL" })).toBeNull();
    const remembered = screen.getByText("Call home").closest("li");
    expect(remembered).toBeTruthy();
    expect(remembered?.textContent).not.toContain("Croma");
  });
});
