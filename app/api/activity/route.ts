import { listEvents } from "@/lib/repository";

export async function GET() {
  try {
    const events = await listEvents();
    return Response.json({ events });
  } catch {
    return Response.json({ message: "We couldn't load activity." }, { status: 500 });
  }
}
