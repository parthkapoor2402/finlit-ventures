import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const shots = "/opt/cursor/artifacts/neuplan";

async function axe(page: Page, name: string) {
  const results = await new AxeBuilder({ page }).analyze();
  if (results.violations.length > 0) {
    console.log(
      name,
      JSON.stringify(
        results.violations.map((violation) => ({
          id: violation.id,
          impact: violation.impact,
          nodes: violation.nodes.map((node) => node.html).slice(0, 3),
        })),
        null,
        2,
      ),
    );
  }
  expect(results.violations, name).toEqual([]);
}

test("intro, seeded week, charger to Croma, and summary fallback", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    if (message.text().includes("favicon")) return;
    if (message.text().includes("404")) return;
    errors.push(message.text());
  });
  page.on("response", (response) => {
    if (response.status() < 400) return;
    if (response.url().includes("favicon")) return;
    errors.push(`${response.status()} ${response.url()}`);
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  const entry = page.getByRole("link", { name: /NeuPlan/ });
  await expect(entry).toHaveCount(1);
  await expect(entry).toContainText("Stay on top of plans, needs and things you do not want to forget.");
  await expect(entry).toContainText("Open NeuPlan");
  await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: /NeuPlan/ })).toHaveCount(0);
  await page.screenshot({ path: `${shots}/home-mobile.png`, fullPage: true });
  await axe(page, "home");

  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({ path: `${shots}/home-375.png`, fullPage: true });
  await page.setViewportSize({ width: 414, height: 896 });
  await page.screenshot({ path: `${shots}/home-414.png`, fullPage: true });
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.screenshot({ path: `${shots}/home-tablet.png`, fullPage: true });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({ path: `${shots}/home-desktop.png`, fullPage: true });
  const phone = await page.locator(".phone").boundingBox();
  expect(phone?.width).toBeLessThanOrEqual(430);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/categories");
  await expect(page.getByRole("link", { name: /NeuPlan/ })).toHaveCount(1);
  await page.screenshot({ path: `${shots}/categories-mobile.png`, fullPage: true });
  await page.goto("/offers");
  await page.screenshot({ path: `${shots}/offers-mobile.png`, fullPage: true });
  await page.goto("/neucard");
  await page.screenshot({ path: `${shots}/neucard-mobile.png`, fullPage: true });
  await page.goto("/scan");
  await expect(page.getByRole("heading", { name: "Scan & Pay" })).toBeVisible();
  await expect(page.getByText("Nothing here can send money.")).toBeVisible();
  await page.screenshot({ path: `${shots}/scan-mobile.png`, fullPage: true });

  await page.goto("/");
  await page.getByRole("link", { name: /Open NeuPlan/ }).click();
  await expect(page.getByRole("heading", { name: "Stay on top of what matters this week." })).toBeVisible();
  await page.screenshot({ path: `${shots}/intro-mobile.png`, fullPage: true });
  await axe(page, "intro");
  await page.getByRole("link", { name: "See an example" }).click();
  await expect(page.getByText("Replace charger")).toBeVisible();
  await expect(page.getByText("EXAMPLE · NOT YOUR WEEK")).toBeVisible();
  await page.screenshot({ path: `${shots}/example-mobile.png`, fullPage: true });
  await page.getByRole("link", { name: "Set up my week" }).click();

  await page.getByRole("button", { name: "Classes" }).click();
  await page.getByRole("button", { name: "Assignments" }).click();
  await page.getByRole("button", { name: "Shopping" }).click();
  await page.getByRole("button", { name: "Travel" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "With family" }).click();
  await page.getByRole("button", { name: "Set up my week" }).click();

  await expect(page.getByRole("heading", { name: /Ananya/ })).toBeVisible();
  await expect(page.getByText("Classes").first()).toBeVisible();
  await expect(page.getByText("Assignment due")).toBeVisible();
  await expect(page.getByRole("link", { name: /Replace charger/ }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Travel home/ }).first()).toBeVisible();
  await expect(page.getByText("Your week is clear.")).toHaveCount(0);
  await page.screenshot({ path: `${shots}/week-mobile.png`, fullPage: true });
  await axe(page, "week");

  await page.getByRole("link", { name: /Replace charger/ }).first().click();
  await expect(page.getByRole("heading", { name: "Replace charger" })).toBeVisible();
  await expect(page.getByText(/Croma may help/)).toBeVisible();
  await page.screenshot({ path: `${shots}/need-charger-mobile.png`, fullPage: true });
  await page.getByRole("button", { name: "Explore on Tata Neu" }).click();
  await expect(page.getByRole("heading", { name: "Croma" })).toBeVisible();
  await expect(page.getByText("USB-C charger")).toBeVisible();
  await expect(page.getByText("₹—")).toBeVisible();
  await expect(page.getByText(/Not live/)).toBeVisible();
  await page.screenshot({ path: `${shots}/demo-croma-mobile.png`, fullPage: true });
  await page.getByRole("button", { name: "View on Croma" }).click();
  await expect(page.getByText("This would open Croma.")).toBeVisible();

  await page.goto("/neuplan");
  await expect(page.getByText("Exploring").first()).toBeVisible();
  await page.getByText("Assignment due", { exact: true }).locator("..").getByRole("button", { name: "Mark done" }).click();
  await expect(page.getByText("Marked done: Assignment due")).toBeVisible();

  await page.goto("/neuplan/summary");
  await page.getByRole("button", { name: "Summarise this week" }).click();
  await expect(page.getByText("Written by the app", { exact: true })).toBeVisible();
  await page.screenshot({ path: `${shots}/summary-mobile.png`, fullPage: true });

  expect(errors, errors.join("\n")).toEqual([]);

  await page.route("**/api/ai/weekly-summary", (route) =>
    route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ message: "no" }) }),
  );
  await page.getByRole("button", { name: "Summarise this week" }).click();
  await expect(page.getByText("We couldn't write the summary.")).toBeVisible();
  await page.unroute("**/api/ai/weekly-summary");
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByText("Written by the app", { exact: true })).toBeVisible();

  await page.goto("/neuplan");
  await expect(page.getByText("Classes").first()).toBeVisible();
  await page.reload();
  await expect(page.getByText("Classes").first()).toBeVisible();
  await page.goBack();
  await page.goForward();
  await expect(page.getByText("Classes").first()).toBeVisible();

  await page.setViewportSize({ width: 768, height: 1024 });
  await page.screenshot({ path: `${shots}/week-tablet.png`, fullPage: true });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.screenshot({ path: `${shots}/week-desktop.png`, fullPage: true });
  const weekPhone = await page.locator(".phone").boundingBox();
  expect(weekPhone?.width).toBeLessThanOrEqual(430);
});
