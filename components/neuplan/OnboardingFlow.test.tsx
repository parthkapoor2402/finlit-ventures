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
    expect(await screen.findByRole("heading", { name: "Where are you living?" })).toBeInTheDocument();
    first.unmount();

    render(<OnboardingFlow />);
    expect(await screen.findByRole("heading", { name: "Where are you living?" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled();
  });

  it("returns to the week question with the browser back control", async () => {
    const user = userEvent.setup();
    render(<OnboardingFlow />);
    await user.click(await screen.findByRole("button", { name: "Study" }));
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await screen.findByRole("heading", { name: "Where are you living?" });
    window.history.back();
    expect(await screen.findByRole("heading", { name: "What does this week include?" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Study" })).toHaveAttribute("aria-pressed", "true");
  });
});
