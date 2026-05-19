import { METER_LABELS, type MeterId } from "@/data/meters";
import type { StoredReading } from "@/lib/readings-storage";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });
}

export function ReadingsDataTable({
  rows,
  meterIds,
}: {
  rows: StoredReading[];
  meterIds: MeterId[];
}) {
  if (rows.length === 0) {
    return (
      <p className="rounded-xl border border-emerald-900/10 bg-emerald-50/40 px-4 py-6 text-sm text-emerald-800">
        Пока нет переданных показаний.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-emerald-900/10">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-emerald-50/80 text-emerald-900">
          <tr>
            <th className="whitespace-nowrap px-4 py-3 font-semibold">Дата</th>
            <th className="whitespace-nowrap px-4 py-3 font-semibold">
              Квартира
            </th>
            {meterIds.map((id) => (
              <th
                key={id}
                className="whitespace-nowrap px-4 py-3 font-semibold"
              >
                {METER_LABELS[id]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-emerald-900/10 bg-white">
          {rows.map((r) => (
            <tr key={r.id} className="text-emerald-950">
              <td className="whitespace-nowrap px-4 py-2.5">
                {formatDate(r.submittedAt)}
              </td>
              <td className="whitespace-nowrap px-4 py-2.5 font-medium">
                {r.apartment}
              </td>
              {meterIds.map((id) => (
                <td key={id} className="whitespace-nowrap px-4 py-2.5">
                  {r.readings[id] ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
