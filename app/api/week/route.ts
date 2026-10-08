import { getWeek } from "@/lib/repository";

export async function GET() {
  try {
    const week = await getWeek();
    return Response.json({ week });
  } catch {
    return Response.json({ message: "We couldn't refresh your week." }, { status: 500 });
  }
}
