import { acknowledgeVisit } from "@/lib/repository";

export async function POST() {
  try {
    const visit = await acknowledgeVisit();
    return Response.json(visit);
  } catch {
    return Response.json({ message: "We couldn't open NeuPlan." }, { status: 500 });
  }
}
