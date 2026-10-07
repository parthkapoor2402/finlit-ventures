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

test("first visit, onboarding, week, need, and summary", async ({ page }) => {
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
  await expect(page.getByRole("link", { name: /NeuPlan/ })).toHaveCount(1);
  await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: /NeuPlan/ })).toHaveCount(0);
  await page.screenshot({ path: `${shots}/home-mobile.png`, fullPage: true });
  await axe(page, "home");

  await page.setViewportSize({ width: 768, height: 1024 });
  await page.screenshot({ path: `${shots}/home-tablet.png`, fullPage: true });
  await page.setViewportSize({ width: 1280, height: 800 });
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
  await page.getByRole("link", { name: /NeuPlan/ }).click();
  await expect(page.getByRole("heading", { name: "What does this week include?" })).toBeVisible();
  await page.screenshot({ path: `${shots}/onboarding-mobile.png`, fullPage: true });
  await axe(page, "onboarding");
  await page.getByRole("button", { name: "Classes" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Hostel" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "See this week in one place" }).click();
  await page.getByRole("button", { name: "Finish", exact: true }).click();

  await expect(page.getByText("Your week is clear.")).toBeVisible();
  await page.screenshot({ path: `${shots}/week-empty-mobile.png`, fullPage: true });
  await axe(page, "week");

  await page.getByLabel("Title").fill("Morning block");
  await page.getByRole("button", { name: "Add something" }).click();
  await expect(page.getByText("Morning block")).toBeVisible();
  await page.getByRole("button", { name: "Edit" }).click();
  await page.getByLabel("Title").fill("Edited block");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Edited block")).toBeVisible();
  await page.getByRole("button", { name: "Mark done" }).click();
  await expect(page.getByText(/Done/)).toBeVisible();
  await page.screenshot({ path: `${shots}/week-item-mobile.png`, fullPage: true });

  await page.getByRole("link", { name: "Needs" }).click();
  await page.getByLabel("Need").fill("Notebook");
  await page.getByRole("button", { name: "Add a need" }).click();
  await expect(page.getByText("Notebook")).toBeVisible();
  await page.screenshot({ path: `${shots}/needs-mobile.png`, fullPage: true });
  await page.getByRole("button", { name: "Croma" }).click();
  await expect(page.getByRole("heading", { name: "Croma" })).toBeVisible();
  await expect(page.getByText(/isLive is false/)).toBeVisible();
  await page.screenshot({ path: `${shots}/demo-croma-mobile.png`, fullPage: true });
  await page.goBack();
  await expect(page.getByRole("heading", { name: "Needs" })).toBeVisible();
  await expect(page.getByText("Notebook")).toBeVisible();

  await page.goto("/neuplan/summary");
  await page.getByRole("button", { name: "Summarise this week" }).click();
  await expect(page.getByText("Written by the app", { exact: true })).toBeVisible();
  await expect(page.getByText(/This week has 1 item/)).toBeVisible();
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
  await expect(page.getByText("Edited block")).toBeVisible();
  await page.reload();
  await expect(page.getByText("Edited block")).toBeVisible();
  await page.getByRole("link", { name: "Week" }).click();
  await expect(page.getByText("Edited block")).toBeVisible();

  await page.setViewportSize({ width: 768, height: 1024 });
  await page.screenshot({ path: `${shots}/week-tablet.png`, fullPage: true });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.screenshot({ path: `${shots}/week-desktop.png`, fullPage: true });
  const weekPhone = await page.locator(".phone").boundingBox();
  expect(weekPhone?.width).toBeLessThanOrEqual(430);
});
