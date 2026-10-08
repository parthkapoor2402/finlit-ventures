import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:4180",
    ...devices["Desktop Chrome"],
    channel: "chrome",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "rm -rf /tmp/neuplan-e2e && mkdir -p /tmp/neuplan-e2e && env -u GEMINI_API_KEY -u GEMINI_MODEL NEUPLAN_DATA_DIR=/tmp/neuplan-e2e npm start",
    url: "http://127.0.0.1:4180",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
