import { RequestError } from "@/lib/errors";
import { getUser, updateUser } from "@/lib/repository";

export async function GET() {
  try {
    const user = await getUser();
    return Response.json({ user });
  } catch {
    return Response.json({ message: "We couldn't open NeuPlan." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return Response.json({ message: "We couldn't save that." }, { status: 400 });
    }
    const user = await updateUser(body);
    return Response.json({ user });
  } catch (error) {
    if (error instanceof RequestError) {
      return Response.json({ message: error.message }, { status: error.status });
    }
    return Response.json({ message: "We couldn't save that." }, { status: 500 });
  }
}
