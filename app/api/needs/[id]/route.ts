import { RequestError } from "@/lib/errors";
import { listMoments, updateNeed, type NeedPatch } from "@/lib/repository";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as unknown;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return Response.json({ message: "We couldn't update that need." }, { status: 400 });
    }
    const need = await updateNeed(id, body as NeedPatch);
    const moments = need.momentId ? await listMoments() : [];
    const moment = moments.find((entry) => entry.id === need.momentId) ?? null;
    return Response.json({ need, moment });
  } catch (error) {
    if (error instanceof RequestError) {
      return Response.json({ message: error.message }, { status: error.status });
    }
    return Response.json({ message: "We couldn't update that need." }, { status: 500 });
  }
}
