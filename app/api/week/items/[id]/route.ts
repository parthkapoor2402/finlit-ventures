import { RequestError } from "@/lib/errors";
import { deleteItem, updateItem, type ItemPatch } from "@/lib/repository";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as unknown;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return Response.json({ message: "We couldn't update that." }, { status: 400 });
    }
    const item = await updateItem(id, body as ItemPatch);
    return Response.json({ item });
  } catch (error) {
    if (error instanceof RequestError) {
      return Response.json({ message: error.message }, { status: error.status });
    }
    return Response.json({ message: "We couldn't update that." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const item = await deleteItem(id);
    return Response.json({ item });
  } catch (error) {
    if (error instanceof RequestError) {
      return Response.json({ message: error.message }, { status: error.status });
    }
    return Response.json({ message: "We couldn't remove that." }, { status: 500 });
  }
}
