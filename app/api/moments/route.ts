import { RequestError } from "@/lib/errors";
import { createMoment, listMoments, type MomentInput } from "@/lib/repository";

export async function GET() {
  try {
    const moments = await listMoments();
    return Response.json({ moments });
  } catch {
    return Response.json({ message: "We could not load what is happening." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return Response.json({ message: "Confirm at least one line." }, { status: 400 });
    }
    const created = await createMoment(body as MomentInput);
    return Response.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof RequestError) {
      return Response.json({ message: error.message }, { status: error.status });
    }
    return Response.json({ message: "We could not save that." }, { status: 500 });
  }
}
