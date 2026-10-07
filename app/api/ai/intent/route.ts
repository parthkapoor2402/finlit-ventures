import { interpretIntent } from "@/lib/ai/intent";
import { recordEvent } from "@/lib/repository";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const text =
      body && typeof body === "object" && !Array.isArray(body) && "text" in body && typeof body.text === "string"
        ? body.text.trim()
        : "";
    if (!text || text.length > 200) {
      return Response.json({ message: "Add a sentence." }, { status: 400 });
    }
    const result = await interpretIntent(text);
    if (result.source === "gemini") {
      await recordEvent("ai_intent_success", { source: "gemini" });
    } else {
      await recordEvent("ai_intent_fallback", {
        source: "fallback",
        reason: (result.reason ?? "request_failed").slice(0, 40),
      });
    }
    return Response.json({ intent: result.intent, source: result.source });
  } catch {
    return Response.json({ message: "We could not read that." }, { status: 500 });
  }
}
