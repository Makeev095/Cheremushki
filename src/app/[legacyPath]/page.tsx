import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BuildingReadingsView } from "@/components/BuildingReadingsView";
import {
  getAllLegacyPaths,
  getBuildingByLegacyPath,
} from "@/lib/legacy-paths";

type Props = { params: Promise<{ legacyPath: string }> };

export function generateStaticParams() {
  return getAllLegacyPaths().map(({ legacyPath }) => ({ legacyPath }));
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { legacyPath } = await params;
  const b = getBuildingByLegacyPath(legacyPath);
  if (!b) return { title: "Дом не найден" };
  return {
    title: `Показания — ${b.title}`,
    description: `Передача показаний приборов учёта: ${b.addressLine}.`,
  };
}

export default async function LegacyBuildingPage({ params }: Props) {
  const { legacyPath } = await params;
  const building = getBuildingByLegacyPath(legacyPath);
  if (!building) notFound();

  return <BuildingReadingsView building={building} />;
}
