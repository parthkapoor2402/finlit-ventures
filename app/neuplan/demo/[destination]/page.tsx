import { notFound } from "next/navigation";
import { DemoStop } from "@/components/neuplan/DemoStop";
import { catalogueEntry, isTataDestination } from "@/lib/catalogue";

export default async function DemoPage({
  params,
  searchParams,
}: {
  params: Promise<{ destination: string }>;
  searchParams: Promise<{ need?: string }>;
}) {
  const { destination } = await params;
  const { need } = await searchParams;
  if (!isTataDestination(destination)) notFound();
  return <DemoStop entry={catalogueEntry(destination)} needId={need} />;
}
