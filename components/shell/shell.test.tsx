import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { BottomNav } from "@/components/shell/BottomNav";
import { CategoriesScreen } from "@/components/shell/CategoriesScreen";
import { HomeScreen } from "@/components/shell/HomeScreen";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function close() {
    this.open = false;
  };
});

describe("shell navigation", () => {
  it("keeps the Tata Neu tabs and does not put NeuPlan in the bar", () => {
    render(<BottomNav />);
    const nav = screen.getByRole("navigation", { name: "Primary" });
    const links = within(nav).getAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual([
      "Home",
      "Categories",
      "Scan & Pay",
      "Offers",
      "NeuCard",
    ]);
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "/",
      "/categories",
      "/scan",
      "/offers",
      "/neucard",
    ]);
    expect(within(nav).getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
    expect(within(nav).queryByRole("link", { name: /neuplan/i })).toBeNull();
  });

  it("offers one NeuPlan entry on Home", async () => {
    const user = userEvent.setup();
    const errors: unknown[] = [];
    const spy = vi.spyOn(console, "error").mockImplementation((...args) => {
      errors.push(args);
    });
    render(<HomeScreen />);
    const entry = screen.getByRole("link", { name: /NeuPlan/i });
    expect(entry).toHaveAttribute("href", "/neuplan");
    expect(entry).toHaveTextContent("Your week. Planned around what matters.");
    expect(screen.getAllByRole("link", { name: /NeuPlan/i })).toHaveLength(1);
    await user.click(screen.getByRole("button", { name: "Send Money" }));
    expect(screen.getByRole("dialog", { name: "Send Money" })).toHaveTextContent("No money will be sent.");
    spy.mockRestore();
    expect(errors).toEqual([]);
  });

  it("offers one NeuPlan row on Categories and no second entry in the grid", () => {
    render(<CategoriesScreen />);
    expect(screen.getAllByRole("link", { name: /NeuPlan/i })).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Grocery" })).toBeInTheDocument();
  });
});
