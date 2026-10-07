import { RequestError } from "@/lib/errors";
import { createItem, type ItemInput } from "@/lib/repository";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return Response.json({ message: "Add a title." }, { status: 400 });
    }
    const item = await createItem(body as ItemInput);
    return Response.json({ item }, { status: 201 });
  } catch (error) {
    if (error instanceof RequestError) {
      return Response.json({ message: error.message }, { status: error.status });
    }
    return Response.json({ message: "We couldn't add that." }, { status: 500 });
  }
}
