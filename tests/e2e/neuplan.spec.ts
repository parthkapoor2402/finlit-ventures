import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const shots = "/opt/cursor/artifacts/neuplan";

test.describe.configure({ mode: "serial" });

function watch(page: Page) {
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
  return errors;
}

async function axe(page: Page, name: string) {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations, name).toEqual([]);
}

test("home entry, viewports, and no week setup", async ({ page }) => {
  const errors = watch(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  const entry = page.getByRole("link", { name: /NeuPlan/ });
  await expect(entry).toHaveCount(1);
  await expect(entry).toContainText("Tell us what's happening. We'll line up what you need.");
  await expect(entry).toContainText("Open NeuPlan");
  await expect(entry).toContainText("New");
  await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: /NeuPlan/ })).toHaveCount(0);
  await expect(page.getByText(/\+15%/)).toHaveCount(0);
  await page.screenshot({ path: `${shots}/home-390.png`, fullPage: true });
  await axe(page, "home");

  await page.setViewportSize({ width: 360, height: 800 });
  await page.screenshot({ path: `${shots}/home-360.png`, fullPage: true });
  await page.setViewportSize({ width: 414, height: 896 });
  await page.screenshot({ path: `${shots}/home-414.png`, fullPage: true });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({ path: `${shots}/home-desktop.png`, fullPage: true });
  const phone = await page.locator(".phone").boundingBox();
  expect(phone?.width).toBeLessThanOrEqual(430);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/categories");
  await expect(page.getByRole("link", { name: /NeuPlan/ })).toHaveCount(1);
  await page.goto("/");
  await page.getByRole("link", { name: /Open NeuPlan/ }).click();
  await expect(page.getByRole("heading", { name: "What are you up to?" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Set up my week" })).toHaveCount(0);
  await expect(page.getByText("Classes")).toHaveCount(0);
  await expect(page.getByText("Assignment due")).toHaveCount(0);
  await expect(page.getByText(/\+15%/)).toHaveCount(0);
  await page.getByRole("button", { name: "See how it works" }).click();
  await expect(page.getByText("Tell us", { exact: true })).toBeVisible();
  await expect(page.getByText("Build your plan")).toBeVisible();
  await expect(page.getByText("Get it done")).toBeVisible();
  await expect(page.getByText("Classes")).toHaveCount(0);
  await page.screenshot({ path: `${shots}/intent-mobile.png`, fullPage: true });
  await axe(page, "intent");
  expect(errors, errors.join("\n")).toEqual([]);
});

test("flow A charger resolves to Croma without a calendar", async ({ page }) => {
  const errors = watch(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/neuplan");
  await page.getByLabel("What is happening?").fill("My charger stopped working");
  const pending = page.waitForResponse((response) => response.url().includes("/api/ai/intent") && response.request().method() === "POST");
  await page.getByRole("button", { name: "Show lines" }).click();
  const body = (await (await pending).json()) as { source?: string };
  expect(body.source).toBe("fallback");
  await expect(page.getByRole("checkbox", { name: "Replace charger" })).toBeChecked();
  await page.getByRole("button", { name: "Confirm" }).click();
  await expect(page.getByRole("heading", { name: /Ananya/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Replace charger/ }).first()).toBeVisible();
  await expect(page.getByText("Classes")).toHaveCount(0);
  await expect(page.getByText("Assignment due")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "THIS WEEK" })).toHaveCount(0);
  await expect(page.getByText(/\+15%/)).toHaveCount(0);
  await page.screenshot({ path: `${shots}/happening-mobile.png`, fullPage: true });
  await axe(page, "happening");
  await page.getByRole("link", { name: /Replace charger/ }).first().click();
  await expect(page.getByRole("heading", { name: "Replace charger" })).toBeVisible();
  await expect(page.getByText(/Croma may help/)).toBeVisible();
  await expect(page.getByText(/\+15%/)).toHaveCount(0);
  await page.screenshot({ path: `${shots}/need-charger-mobile.png`, fullPage: true });
  await axe(page, "need");
  expect(errors, errors.join("\n")).toEqual([]);
});

test("flow B going home keeps travel only when that line is selected", async ({ page }) => {
  const errors = watch(page);
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/neuplan/new");
  await page.getByRole("button", { name: "Going somewhere" }).click();
  await expect(page.getByLabel("What is happening?")).toHaveValue("Going home this weekend");
  await page.getByRole("button", { name: "Show lines" }).click();
  await expect(page.getByRole("checkbox", { name: "Travel home" })).not.toBeChecked();
  await expect(page.getByRole("checkbox", { name: "Pack" })).not.toBeChecked();
  await expect(page.getByRole("checkbox", { name: "A gift" })).not.toBeChecked();
  await expect(page.getByRole("button", { name: "Confirm" })).toBeDisabled();
  await page.getByRole("checkbox", { name: "Travel home" }).check();
  await page.getByRole("button", { name: "Confirm" }).click();
  await expect(page.getByRole("link", { name: /Travel home/ }).first()).toBeVisible();
  await expect(page.getByText("Pack", { exact: true })).toHaveCount(0);
  await expect(page.getByText("A gift", { exact: true })).toHaveCount(0);
  await page.getByRole("link", { name: /Travel home/ }).first().click();
  await expect(page.getByText(/Air India may help/)).toBeVisible();
  await page.screenshot({ path: `${shots}/need-travel-360.png`, fullPage: true });
  expect(errors, errors.join("\n")).toEqual([]);
});

test("flow C friends coming does not force a shop", async ({ page }) => {
  const errors = watch(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/neuplan/new");
  await page.getByRole("button", { name: "Friends coming" }).click();
  await page.getByRole("button", { name: "Show lines" }).click();
  await expect(page.getByRole("checkbox", { name: "Groceries" })).not.toBeChecked();
  await expect(page.getByRole("checkbox", { name: "A plan" })).not.toBeChecked();
  await page.getByRole("checkbox", { name: "A plan" }).check();
  await page.getByRole("button", { name: "Confirm" }).click();
  await page.getByRole("link", { name: /A plan/ }).first().click();
  await expect(page.getByText("Tata Neu cannot finish this.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Explore on Tata Neu" })).toHaveCount(0);
  await expect(page.getByText("BigBasket")).toHaveCount(0);
  await page.screenshot({ path: `${shots}/need-plan-mobile.png`, fullPage: true });
  expect(errors, errors.join("\n")).toEqual([]);
});

test("flow D exam week does not force commerce", async ({ page }) => {
  const errors = watch(page);
  await page.setViewportSize({ width: 414, height: 896 });
  await page.goto("/neuplan/new");
  await page.getByRole("button", { name: "Exam week" }).click();
  await page.getByRole("button", { name: "Show lines" }).click();
  await expect(page.getByRole("checkbox", { name: "Study" })).not.toBeChecked();
  await expect(page.getByRole("checkbox", { name: "A reminder" })).not.toBeChecked();
  await page.getByRole("checkbox", { name: "Study" }).check();
  await page.getByRole("checkbox", { name: "A reminder" }).check();
  await page.getByRole("button", { name: "Confirm" }).click();
  await page.getByRole("link", { name: /^Study/ }).first().click();
  await expect(page.getByRole("heading", { name: "Study" })).toBeVisible();
  await expect(page.getByText("Tata Neu cannot finish this.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Explore on Tata Neu" })).toHaveCount(0);
  await expect(page.getByText("Croma")).toHaveCount(0);
  await page.screenshot({ path: `${shots}/need-exam-414.png`, fullPage: true });
  expect(errors, errors.join("\n")).toEqual([]);
});

test("flow E exploring and done come from real actions", async ({ page }) => {
  const errors = watch(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/neuplan");
  await page.getByRole("link", { name: /Replace charger/ }).first().click();
  await page.getByRole("button", { name: "Explore on Tata Neu" }).click();
  await expect(page.getByRole("heading", { name: "Croma" })).toBeVisible();
  await expect(page.getByText("USB-C charger")).toBeVisible();
  await expect(page.getByText("₹—")).toBeVisible();
  await expect(page.getByText(/Not live/)).toBeVisible();
  await page.screenshot({ path: `${shots}/demo-croma-mobile.png`, fullPage: true });
  await page.getByRole("button", { name: "View on Croma" }).click();
  await expect(page.getByText("This would open Croma.")).toBeVisible();
  await page.getByRole("link", { name: "Back to NeuPlan" }).click();
  await expect(page.getByText("Exploring")).toBeVisible();
  await page.getByRole("button", { name: "Mark done" }).click();
  await expect(page.getByText("Done: Replace charger")).toBeVisible();
  await expect(page.getByText("your trip is tomorrow")).toHaveCount(0);
  expect(errors, errors.join("\n")).toEqual([]);
});

test("flow F fallback still creates a plan", async ({ page }) => {
  const errors = watch(page);
  await page.goto("/neuplan/new");
  await page.getByLabel("What is happening?").fill("Planning the weekend");
  const pending = page.waitForResponse((response) => response.url().includes("/api/ai/intent") && response.request().method() === "POST");
  await page.getByRole("button", { name: "Show lines" }).click();
  const body = (await (await pending).json()) as { source?: string; intent?: { suggestions?: { title: string }[] } };
  expect(body.source).toBe("fallback");
  expect(body.intent?.suggestions?.some((line) => line.title === "A plan")).toBe(true);
  await page.getByRole("checkbox", { name: "A plan" }).check();
  await page.getByRole("button", { name: "Confirm" }).click();
  await expect(page.getByRole("heading", { name: /Ananya/ })).toBeVisible();
  await expect(page.getByText("Weekend", { exact: true }).first()).toBeVisible();
  expect(errors, errors.join("\n")).toEqual([]);
});

test("flow G refresh keeps the plan", async ({ page }) => {
  const errors = watch(page);
  await page.goto("/neuplan");
  await expect(page.getByRole("link", { name: /Travel home/ }).first()).toBeVisible();
  await page.reload();
  await expect(page.getByRole("link", { name: /Travel home/ }).first()).toBeVisible();
  await expect(page.getByText("Weekend", { exact: true }).first()).toBeVisible();
  expect(errors, errors.join("\n")).toEqual([]);
});

test("flow H back button returns to the open list", async ({ page }) => {
  const errors = watch(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/neuplan");
  await page.getByRole("link", { name: /Travel home/ }).first().click();
  await expect(page.getByRole("heading", { name: "Travel home" })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole("heading", { name: /Ananya/ })).toBeVisible();
  await page.goForward();
  await expect(page.getByRole("heading", { name: "Travel home" })).toBeVisible();
  const phone = await page.locator(".phone").boundingBox();
  expect(phone?.width).toBeLessThanOrEqual(430);
  await page.screenshot({ path: `${shots}/need-desktop.png`, fullPage: true });
  expect(errors, errors.join("\n")).toEqual([]);
});
