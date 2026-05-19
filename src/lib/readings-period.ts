import type { StoredReading } from "@/lib/readings-storage";

export const READINGS_TIMEZONE = "Europe/Moscow";

const PERIOD_RE = /^(\d{4})-(0[1-9]|1[0-2])$/;

const MONTH_NAMES: Record<number, string> = {
  1: "январь",
  2: "февраль",
  3: "март",
  4: "апрель",
  5: "май",
  6: "июнь",
  7: "июль",
  8: "август",
  9: "сентябрь",
  10: "октябрь",
  11: "ноябрь",
  12: "декабрь",
};

/** Ключ периода YYYY-MM по дате передачи (календарь Москвы). */
export function periodKeyFromIso(iso: string): string | null {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: READINGS_TIMEZONE,
    year: "numeric",
    month: "2-digit",
  }).formatToParts(d);
  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  if (!year || !month) return null;
  return `${year}-${month}`;
}

export function parsePeriodParam(
  raw: string | null | undefined,
): string | null {
  if (!raw || raw === "all") return null;
  const t = raw.trim();
  return PERIOD_RE.test(t) ? t : null;
}

export function formatPeriodLabel(period: string): string {
  const m = PERIOD_RE.exec(period);
  if (!m) return period;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const name = MONTH_NAMES[month] ?? String(month);
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} ${year}`;
}

export function filterReadingsByPeriod(
  rows: StoredReading[],
  period: string | null,
): StoredReading[] {
  if (!period) return rows;
  return rows.filter((r) => periodKeyFromIso(r.submittedAt) === period);
}

export function collectAvailablePeriods(rows: StoredReading[]): string[] {
  const set = new Set<string>();
  for (const r of rows) {
    const k = periodKeyFromIso(r.submittedAt);
    if (k) set.add(k);
  }
  return [...set].sort((a, b) => b.localeCompare(a));
}

export function periodOptionsFromRows(rows: StoredReading[]): {
  value: string;
  label: string;
}[] {
  return collectAvailablePeriods(rows).map((value) => ({
    value,
    label: formatPeriodLabel(value),
  }));
}
