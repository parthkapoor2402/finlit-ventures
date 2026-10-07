import type { AnalyticsEventName, AnalyticsProps } from "@/lib/types";

export async function track(name: AnalyticsEventName, props?: AnalyticsProps): Promise<void> {
  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, props }),
    });
  } catch {
    // A missed event must not block the screen.
  }
}

const SESSION_KEY = "neuplan.session_meaningful";

export async function markMeaningfulSession(): Promise<void> {
  if (typeof window === "undefined") return;
  if (window.sessionStorage.getItem(SESSION_KEY) === "1") return;
  window.sessionStorage.setItem(SESSION_KEY, "1");
  await track("session_meaningful", { source: "action" });
}
