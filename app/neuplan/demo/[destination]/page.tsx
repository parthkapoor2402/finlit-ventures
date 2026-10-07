import { notFound } from "next/navigation";
import { DemoStop } from "@/components/neuplan/DemoStop";
import { catalogueEntry, isTataDestination } from "@/lib/catalogue";

export default async function DemoPage({ params }: { params: Promise<{ destination: string }> }) {
  const { destination } = await params;
  if (!isTataDestination(destination)) notFound();
  return <DemoStop entry={catalogueEntry(destination)} />;
}
