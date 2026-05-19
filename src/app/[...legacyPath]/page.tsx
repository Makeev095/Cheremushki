import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BuildingReadingsView } from "@/components/BuildingReadingsView";
import {
  getAllLegacyPaths,
  getBuildingByLegacyPath,
} from "@/lib/legacy-paths";

type Props = { params: Promise<{ legacyPath: string[] }> };

function joinLegacyPath(segments: string[]): string {
  return segments.map((s) => decodeURIComponent(s)).join("/");
}

export function generateStaticParams() {
  return getAllLegacyPaths().map(({ legacyPath }) => ({
    legacyPath: legacyPath.split("/"),
  }));
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { legacyPath } = await params;
  const b = getBuildingByLegacyPath(joinLegacyPath(legacyPath));
  if (!b) return { title: "Дом не найден" };
  return {
    title: `Показания — ${b.title}`,
    description: `Передача показаний индивидуальных приборов учёта: ${b.addressLine}.`,
  };
}

export default async function LegacyBuildingPage({ params }: Props) {
  const { legacyPath } = await params;
  if (legacyPath.length > 2) notFound();

  const building = getBuildingByLegacyPath(joinLegacyPath(legacyPath));
  if (!building) notFound();

  return <BuildingReadingsView building={building} />;
}
