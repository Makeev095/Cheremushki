import Link from "next/link";
import type { SuspiciousRecord } from "@/lib/suspicious-readings";
import { formatPeriodLabel } from "@/lib/readings-period";

export function SuspiciousReadingsTable({
  records,
}: {
  records: SuspiciousRecord[];
}) {
  if (records.length === 0) {
    return (
      <p className="rounded-2xl border border-emerald-900/10 bg-emerald-50/40 px-5 py-6 text-sm text-emerald-800">
        Подозрительных передач не найдено. Учитываются квартиры, у которых расход
        в месяце в <strong>2,5 раза и более</strong> ниже среднего за три
        предыдущих месяца (по каждому счётчику отдельно). Нужна история минимум
        за 4 месяца.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-amber-200/80 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-amber-50/90 text-amber-950">
          <tr>
            <th className="whitespace-nowrap px-4 py-3 font-semibold">Период</th>
            <th className="whitespace-nowrap px-4 py-3 font-semibold">Дом</th>
            <th className="whitespace-nowrap px-4 py-3 font-semibold">
              Квартира
            </th>
            <th className="min-w-[16rem] px-4 py-3 font-semibold">
              Счётчики (расход / среднее за 3 мес.)
            </th>
            <th className="whitespace-nowrap px-4 py-3 font-semibold" />
          </tr>
        </thead>
        <tbody className="divide-y divide-amber-100">
          {records.map((r) => (
            <tr key={r.id} className="text-emerald-950">
              <td className="whitespace-nowrap px-4 py-3">
                {formatPeriodLabel(r.period)}
              </td>
              <td className="px-4 py-3">
                <div className="font-medium">{r.buildingTitle}</div>
                <div className="text-xs text-emerald-800/75">{r.slug}</div>
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-semibold">
                {r.apartment}
              </td>
              <td className="px-4 py-3">
                <ul className="space-y-2">
                  {r.meters.map((m) => (
                    <li key={m.meterId} className="text-xs leading-relaxed">
                      <span className="font-medium">{m.meterLabel}:</span>{" "}
                      {m.currentConsumption} (сейчас) при среднем{" "}
                      {m.avgPriorConsumption} — в{" "}
                      <strong>{m.timesBelow}×</strong> ниже нормы
                    </li>
                  ))}
                </ul>
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <Link
                  href={`/admin/readings/${r.slug}?period=${r.period}`}
                  className="text-sm font-medium text-emerald-800 hover:text-emerald-950"
                >
                  Таблица дома
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
