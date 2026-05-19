import type { Metadata } from "next";
import Link from "next/link";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";
import { InnerPageSurface } from "@/components/InnerPageSurface";
import { SuspiciousReadingsTable } from "@/components/SuspiciousReadingsTable";
import { getBuildingBySlug } from "@/data/buildings";
import { requireAdmin } from "@/lib/require-admin";
import { readAllSuspiciousRecords, rebuildSuspiciousIndex } from "@/lib/suspicious-readings";

export const metadata: Metadata = {
  title: "Подозрительные показания — админ",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminSuspiciousPage() {
  await requireAdmin("/admin/suspicious");

  await rebuildSuspiciousIndex((slug) => getBuildingBySlug(slug)?.meters ?? []);
  const records = await readAllSuspiciousRecords();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <InnerPageSurface>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/admin/readings"
            className="text-sm font-medium text-emerald-800 hover:text-emerald-950"
          >
            ← Показания
          </Link>
          <AdminLogoutButton />
        </div>

        <h1 className="mt-6 text-2xl font-bold tracking-tight text-emerald-950">
          Подозрительные показания
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-emerald-900/85">
          
        </p>

        <div className="mt-8">
          <SuspiciousReadingsTable records={records} />
        </div>
      </InnerPageSurface>
    </main>
  );
}
