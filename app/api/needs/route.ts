import { RequestError } from "@/lib/errors";
import { createNeed, listNeeds, type NeedInput } from "@/lib/repository";

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
    const need = await createNeed(body as NeedInput);
    return Response.json({ need }, { status: 201 });
  } catch (error) {
    if (error instanceof RequestError) {
      return Response.json({ message: error.message }, { status: error.status });
    }
    return Response.json({ message: "We couldn't add that need." }, { status: 500 });
  }
}
