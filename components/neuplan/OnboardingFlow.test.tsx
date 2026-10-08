import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { OnboardingFlow } from "@/components/neuplan/OnboardingFlow";
import { resetOnboardingSnapshot } from "@/components/neuplan/onboarding-store";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

describe("OnboardingFlow", () => {
  beforeEach(() => {
    localStorage.clear();
    resetOnboardingSnapshot();
    window.history.replaceState({}, "", "/neuplan/onboarding");
  });

  it("does not continue until a week shape is chosen, then keeps it after remount", async () => {
    const user = userEvent.setup();
    const first = render(<OnboardingFlow />);
    const continueButton = await screen.findByRole("button", { name: "Continue" });
    expect(continueButton).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Classes" }));
    expect(continueButton).toBeEnabled();
    await user.click(continueButton);
    expect(await screen.findByRole("heading", { name: "Where do you usually stay?" })).toBeInTheDocument();
    first.unmount();

    render(<OnboardingFlow />);
    expect(await screen.findByRole("heading", { name: "Where do you usually stay?" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Set up my week" })).toBeDisabled();
  });

  it("returns to the week question with the browser back control", async () => {
    const user = userEvent.setup();
    render(<OnboardingFlow />);
    await user.click(await screen.findByRole("button", { name: "Assignments" }));
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await screen.findByRole("heading", { name: "Where do you usually stay?" });
    window.history.back();
    expect(await screen.findByRole("heading", { name: "What matters this week?" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Assignments" })).toHaveAttribute("aria-pressed", "true");
  });
});
