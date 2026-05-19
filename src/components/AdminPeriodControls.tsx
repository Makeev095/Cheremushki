"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { formatPeriodLabel } from "@/lib/readings-period";
import { readingsExportHref } from "@/lib/readings-export-href";

const btnPrimary =
  "inline-flex rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700";
const btnDisabled =
  "inline-flex cursor-not-allowed rounded-xl bg-emerald-800/40 px-4 py-2.5 text-sm font-semibold text-white/90";

export function AdminPeriodControls({
  periods,
  slug,
  buildingTitle,
  showDownloadAll = false,
  recordCount,
}: {
  periods: { value: string; label: string }[];
  slug?: string;
  buildingTitle?: string;
  showDownloadAll?: boolean;
  recordCount?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPeriod = searchParams.get("period") ?? "all";

  const periodForExport =
    currentPeriod !== "all" ? currentPeriod : null;

  const exportAllHref = useMemo(
    () => readingsExportHref({ period: periodForExport }),
    [periodForExport],
  );

  const exportBuildingHref = useMemo(
    () =>
      slug
        ? readingsExportHref({ slug, period: periodForExport })
        : exportAllHref,
    [slug, periodForExport, exportAllHref],
  );

  const periodHint =
    currentPeriod !== "all"
      ? formatPeriodLabel(currentPeriod)
      : "все периоды";

  const onPeriodChange = useCallback(
    (value: string) => {
      const next = new URLSearchParams(searchParams.toString());
      if (value === "all") next.delete("period");
      else next.set("period", value);
      const q = next.toString();
      router.push(q ? `${pathname}?${q}` : pathname);
    },
    [pathname, router, searchParams],
  );

  const canDownloadBuilding =
    slug != null && recordCount !== undefined && recordCount > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
        <label className="block text-sm">
          <span className="font-medium text-emerald-950">Период</span>
          <select
            value={currentPeriod}
            onChange={(e) => onPeriodChange(e.target.value)}
            className="mt-2 block w-full min-w-[12rem] rounded-xl border border-emerald-900/15 bg-white px-4 py-2.5 text-emerald-950 outline-none ring-emerald-600/20 focus:ring-2 sm:w-auto"
          >
            <option value="all">Все периоды</option>
            {periods.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-wrap items-center gap-3">
          {showDownloadAll &&
            (recordCount !== undefined && recordCount > 0 ? (
              <a href={exportAllHref} className={btnPrimary}>
                Скачать все дома (Excel)
              </a>
            ) : (
              <span
                className={btnDisabled}
                title="Нет показаний за выбранный период"
              >
                Скачать все дома (Excel)
              </span>
            ))}

          {slug &&
            (canDownloadBuilding ? (
              <a href={exportBuildingHref} className={btnPrimary}>
                Скачать Excel — {buildingTitle ?? "дом"}
              </a>
            ) : (
              <span
                className={btnDisabled}
                title="Нет показаний за выбранный период"
              >
                Скачать Excel — {buildingTitle ?? "дом"}
              </span>
            ))}

          {recordCount !== undefined && (
            <span className="text-sm text-emerald-800">
              Записей: <strong>{recordCount}</strong>
              <span className="text-emerald-800/75"> ({periodHint})</span>
            </span>
          )}
        </div>
      </div>

      {showDownloadAll && (
        <p className="text-xs text-emerald-800/80">
          
        </p>
      )}
    </div>
  );
}

/** Excel одного дома за выбранный вверху период (страница списка домов). */
export function AdminBuildingExportLink({
  slug,
  buildingTitle,
  hasRecords,
}: {
  slug: string;
  buildingTitle: string;
  hasRecords: boolean;
}) {
  const searchParams = useSearchParams();
  const period = searchParams.get("period");
  const periodForExport = period && period !== "all" ? period : null;
  const href = readingsExportHref({ slug, period: periodForExport });

  const periodHint =
    periodForExport != null
      ? formatPeriodLabel(periodForExport)
      : "все периоды";

  if (!hasRecords) {
    return (
      <span
        className="rounded-xl border border-emerald-900/10 bg-emerald-50/50 px-3 py-2 text-sm font-semibold text-emerald-800/45"
        title={`Нет показаний за период: ${periodHint}`}
      >
        Скачать Excel
      </span>
    );
  }

  return (
    <a
      href={href}
      title={`Показания: ${buildingTitle}, ${periodHint}`}
      className="rounded-xl border border-emerald-800/30 bg-white px-3 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"
    >
      Скачать Excel
    </a>
  );
}
