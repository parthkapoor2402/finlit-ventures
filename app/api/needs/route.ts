import { interpretIntent } from "@/lib/ai/intent";
import { RequestError } from "@/lib/errors";
import { createMoment, createNeed, listNeeds, type NeedInput } from "@/lib/repository";

export async function GET() {
  try {
    const needs = await listNeeds();
    return Response.json({ needs });
  } catch {
    return Response.json({ message: "We couldn't load needs." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return Response.json({ message: "Add a title." }, { status: 400 });
    }
    const input = body as NeedInput;
    const text = typeof input.title === "string" ? input.title : "";
    const interpreted = await interpretIntent(text);
    const suggestions = interpreted.intent.suggestions;
    if (suggestions.length >= 2) {
      const created = await createMoment({
        title: interpreted.intent.title,
        kind: interpreted.intent.kind,
        day: interpreted.intent.day ?? input.day,
        lines: suggestions.map((line) => ({ title: line.title, type: line.type })),
      });
      return Response.json(
        {
          moment: created.moment,
          needs: created.needs,
          decomposed: true,
          source: interpreted.source,
          reason: interpreted.reason,
        },
        { status: 201 },
      );
    }
    const line = suggestions[0];
    const words = text.trim().split(/\s+/).filter(Boolean);
    const extracted =
      suggestions.length === 1 &&
      line !== undefined &&
      words.length >= 4 &&
      line.title.trim().toLowerCase() !== text.trim().toLowerCase();
    const need = await createNeed(
      extracted && line
        ? {
            type: line.type,
            title: line.title,
            day: interpreted.intent.day ?? input.day,
            time: input.time,
          }
        : input,
    );
    return Response.json(
      { need, decomposed: false, source: interpreted.source, reason: interpreted.reason },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof RequestError) {
      return Response.json({ message: error.message }, { status: error.status });
    }
    return Response.json({ message: "We couldn't add that need." }, { status: 500 });
  }
}
