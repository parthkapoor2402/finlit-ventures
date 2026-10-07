import { dismissNotices, listNotices } from "@/lib/repository";

export async function GET() {
  try {
    const notices = await listNotices();
    return Response.json({ notices });
  } catch {
    return Response.json({ message: "We couldn't refresh your week." }, { status: 500 });
  }
}

export async function POST() {
  try {
    await dismissNotices();
    return Response.json({ ok: true });
  } catch {
    return Response.json({ message: "We couldn't refresh your week." }, { status: 500 });
  }
}
