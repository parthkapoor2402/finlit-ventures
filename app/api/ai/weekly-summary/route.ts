import { createWeeklySummary } from "@/lib/ai/summary";
import { recordEvent } from "@/lib/repository";

export async function POST() {
  try {
    const result = await createWeeklySummary();
    if (!result.cached) {
      if (result.insight.source === "gemini") {
        await recordEvent("ai_summary_generated", { source: "gemini" });
      } else {
        await recordEvent("ai_summary_fallback", {
          source: "fallback",
          reason: result.insight.fallbackReason ?? "request_failed",
        });
      }
    }
    return Response.json(result);
  } catch {
    return Response.json({ message: "We couldn't write the summary." }, { status: 500 });
  }
}
