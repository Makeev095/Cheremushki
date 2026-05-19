import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";
import {
  AdminBuildingExportLink,
  AdminPeriodControls,
} from "@/components/AdminPeriodControls";
import { InnerPageSurface } from "@/components/InnerPageSurface";
import { getAllBuildings } from "@/data/buildings";
import {
  filterReadingsByPeriod,
  formatPeriodLabel,
  parsePeriodParam,
  periodOptionsFromRows,
} from "@/lib/readings-period";
import { requireAdmin } from "@/lib/require-admin";
import { readAllReadings } from "@/lib/readings-storage";

export const metadata: Metadata = {
  title: "Показания — админ",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ period?: string }> };

export default async function AdminReadingsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const period = parsePeriodParam(sp.period);
  const returnPath =
    period != null ? `/admin/readings?period=${period}` : "/admin/readings";
  await requireAdmin(returnPath);

  const buildings = getAllBuildings();
  const all = await readAllReadings();
  const filtered = filterReadingsByPeriod(all, period);
  const periods = periodOptionsFromRows(all);
  const totalOnServer = all.length;
  const totalFiltered = filtered.length;
  const periodFiltered = period != null;

  const counts: Record<string, number> = {};
  for (const r of filtered) {
    counts[r.slug] = (counts[r.slug] ?? 0) + 1;
  }

  return (
    <main className="mx-auto max-w-5xl px-3 py-8 sm:px-6 sm:py-14">
      <InnerPageSurface>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="text-sm font-medium text-emerald-800 hover:text-emerald-950"
          >
            ← На главную
          </Link>
          <AdminLogoutButton />
        </div>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-emerald-950">
          Показания счётчиков
        </h1>
        <div className="mt-6 rounded-2xl border border-emerald-900/10 bg-emerald-50/50 px-4 py-4 text-sm text-emerald-900/90 sm:px-5">
          <p>
            Все показания хранятся <strong className="text-emerald-950">на сервере</strong>{" "}
            в одном файле — с телефона, планшета и компьютера в админке на{" "}
            <strong className="text-emerald-950">cheremushki.online</strong> числа
            одинаковые.
          </p>
          <p className="mt-2">
            Всего записей на сервере:{" "}
            <strong className="text-emerald-950">{totalOnServer}</strong>
            {periodFiltered ? (
              <>
                {" "}
                · за период «{formatPeriodLabel(period)}»:{" "}
                <strong className="text-emerald-950">{totalFiltered}</strong>
              </>
            ) : null}
          </p>
          {periodFiltered && totalFiltered !== totalOnServer ? (
            <p className="mt-2 font-medium text-amber-950">
              Включён фильтр по месяцу — часть записей скрыта.{" "}
              <Link
                href="/admin/readings"
                className="underline decoration-amber-600 underline-offset-2 hover:text-amber-900"
              >
                Показать все периоды
              </Link>
            </p>
          ) : null}
        </div>

        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <Link
            href="/admin/suspicious"
            className="font-medium text-amber-900 hover:text-amber-950"
          >
            Подозрительные показания
          </Link>
          <Link
            href="/admin/readings-window"
            className="font-medium text-emerald-800 hover:text-emerald-950"
          >
            Настройки видимости формы показаний
          </Link>
        </div>

        <Suspense fallback={<p className="mt-8 text-sm text-emerald-800">…</p>}>
          <div className="mt-8">
            <AdminPeriodControls
              periods={periods}
              showDownloadAll
              recordCount={totalFiltered}
            />
          </div>
        </Suspense>

        <ul className="mt-10 space-y-3">
          {buildings.map((b) => {
            const n = counts[b.slug] ?? 0;
            const tableHref =
              period != null
                ? `/admin/readings/${b.slug}?period=${period}`
                : `/admin/readings/${b.slug}`;
            return (
              <li
                key={b.slug}
                className="flex flex-col gap-3 rounded-2xl border border-emerald-900/10 bg-white px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-5"
              >
                <div>
                  <p className="font-semibold text-emerald-950">{b.title}</p>
                  <p className="text-sm text-emerald-800/90">
                    {n === 0
                      ? "Нет показаний за выбранный период"
                      : `${n} ${n === 1 ? "запись" : n < 5 ? "записи" : "записей"}`}
                  </p>
                </div>
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                  <Link
                    href={tableHref}
                    className="inline-flex min-h-11 items-center justify-center rounded-xl border border-emerald-800/30 bg-emerald-50/50 px-3 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"
                  >
                    Таблица
                  </Link>
                  <Suspense fallback={null}>
                    <AdminBuildingExportLink
                      slug={b.slug}
                      buildingTitle={b.title}
                      hasRecords={n > 0}
                    />
                  </Suspense>
                </div>
              </li>
            );
          })}
        </ul>
      </InnerPageSurface>
    </main>
  );
}
