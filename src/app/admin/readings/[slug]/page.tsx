import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminPeriodControls } from "@/components/AdminPeriodControls";
import { InnerPageSurface } from "@/components/InnerPageSurface";
import { ReadingsDataTable } from "@/components/ReadingsDataTable";
import { getBuildingBySlug } from "@/data/buildings";
import { requireAdmin } from "@/lib/require-admin";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";
import {
  filterReadingsByPeriod,
  parsePeriodParam,
  periodOptionsFromRows,
} from "@/lib/readings-period";
import { readAllReadings, readReadingsBySlug } from "@/lib/readings-storage";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ period?: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const b = getBuildingBySlug(slug);
  if (!b) return { title: "Дом не найден" };
  return {
    title: `Показания — ${b.title} (админ)`,
    robots: { index: false, follow: false },
  };
}

export default async function AdminBuildingReadingsPage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const building = getBuildingBySlug(slug);
  if (!building) notFound();

  const sp = await searchParams;
  const period = parsePeriodParam(sp.period);
  const returnPath =
    period != null
      ? `/admin/readings/${slug}?period=${period}`
      : `/admin/readings/${slug}`;
  await requireAdmin(returnPath);

  const allForPeriods = await readAllReadings();
  const periods = periodOptionsFromRows(allForPeriods);
  const raw = await readReadingsBySlug(slug);
  const rows = filterReadingsByPeriod(raw, period);

  const backHref =
    period != null ? `/admin/readings?period=${period}` : "/admin/readings";

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <InnerPageSurface>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={backHref}
            className="text-sm font-medium text-emerald-800 hover:text-emerald-950"
          >
            ← Все дома
          </Link>
          <AdminLogoutButton />
        </div>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-emerald-950">
          {building.title}
        </h1>
        <p className="mt-2 text-sm text-emerald-900/85">{building.addressLine}</p>

        <Suspense fallback={<p className="mt-6 text-sm text-emerald-800">…</p>}>
          <div className="mt-6">
            <AdminPeriodControls
              periods={periods}
              slug={slug}
              buildingTitle={building.title}
              recordCount={rows.length}
            />
          </div>
        </Suspense>

        <div className="mt-8">
          <ReadingsDataTable rows={rows} meterIds={building.meters} />
        </div>
      </InnerPageSurface>
    </main>
  );
}
