import { RequestError } from "@/lib/errors";
import { recordEvent } from "@/lib/repository";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { name?: unknown; props?: unknown };
    const event = await recordEvent(body.name, body.props);
    return Response.json({ event });
  } catch (error) {
    if (error instanceof RequestError) {
      return Response.json({ message: error.message }, { status: error.status });
    }
    return Response.json({ message: "We couldn't record that." }, { status: 500 });
  }
}
