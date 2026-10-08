import { NeedDetail } from "@/components/neuplan/NeedDetail";

export default async function NeedPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <NeedDetail id={id} />;
}
