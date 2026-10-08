import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NeuPlanGate } from "@/components/neuplan/NeuPlanGate";
import type { User } from "@/lib/types";

const replace = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, push: vi.fn() }),
}));

const user: User = {
  id: "demo-ananya",
  displayName: "Ananya",
  isDemo: true,
  demoLabel: "DEMO DATA",
  livingSituation: null,
  weekShapes: [],
  helpWith: [],
  note: null,
  lastSeenAt: null,
  onboardingComplete: false,
  onboardingCompletedAt: null,
};

describe("NeuPlanGate", () => {
  it("opens on the intent screen and does not send a new person through week setup", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.endsWith("/api/user")) return Response.json({ user });
        if (url.endsWith("/api/moments")) return Response.json({ moments: [] });
        if (url.endsWith("/api/needs")) return Response.json({ needs: [] });
        return Response.json({});
      }),
    );
    render(<NeuPlanGate />);
    expect(await screen.findByRole("heading", { name: "What are you up to?" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Set up my week" })).toBeNull();
    expect(replace).not.toHaveBeenCalled();
  });
});
