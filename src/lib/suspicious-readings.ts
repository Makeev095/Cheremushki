import { mkdir, readFile, appendFile } from "node:fs/promises";
import type { MeterId } from "@/data/meters";
import { dataFilePath, getDataDir } from "@/lib/data-dir";
import { METER_LABELS } from "@/data/meters";
import { formatPeriodLabel, periodKeyFromIso } from "@/lib/readings-period";
import type { StoredReading } from "@/lib/readings-storage";
import { readAllReadings } from "@/lib/readings-storage";

/** Потребление в 2,5+ раза ниже среднего за 3 предыдущих месяца */
export const SUSPICIOUS_RATIO_THRESHOLD = 2.5;

export interface SuspiciousMeterDetail {
  meterId: MeterId;
  meterLabel: string;
  currentConsumption: number;
  avgPriorConsumption: number;
  /** во сколько раз ниже среднего (avg / current) */
  timesBelow: number;
}

export interface SuspiciousRecord {
  id: string;
  readingId: string;
  slug: string;
  buildingTitle: string;
  apartment: string;
  period: string;
  submittedAt: string;
  meters: SuspiciousMeterDetail[];
}

const SUSPICIOUS_FILE = dataFilePath("suspicious-readings.jsonl");

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function parseMeterValue(raw: string | undefined): number | null {
  if (raw === undefined || raw === "") return null;
  const n = Number(raw.replace(",", "."));
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

function shiftPeriod(period: string, monthsBack: number): string {
  const [y, m] = period.split("-").map(Number);
  let month = m - monthsBack;
  let year = y;
  while (month < 1) {
    month += 12;
    year -= 1;
  }
  while (month > 12) {
    month -= 12;
    year += 1;
  }
  return `${year}-${String(month).padStart(2, "0")}`;
}

/** Последнее показание в каждом месяце по счётчику */
function monthlyMeterValues(
  rows: StoredReading[],
  meterIds: MeterId[],
): Map<string, Partial<Record<MeterId, number>>> {
  const sorted = [...rows].sort(
    (a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime(),
  );
  const byPeriod = new Map<string, Partial<Record<MeterId, number>>>();

  for (const row of sorted) {
    const period = periodKeyFromIso(row.submittedAt);
    if (!period) continue;
    const cur = byPeriod.get(period) ?? {};
    for (const id of meterIds) {
      const v = parseMeterValue(row.readings[id]);
      if (v !== null) cur[id] = v;
    }
    byPeriod.set(period, cur);
  }
  return byPeriod;
}

function consumption(
  current: number | undefined,
  previous: number | undefined,
): number | null {
  if (current === undefined || previous === undefined) return null;
  const d = current - previous;
  if (d < 0) return null;
  return d;
}

/**
 * Сравнивает расход в `period` со средним расходом за 3 предыдущих месяца.
 */
export function detectSuspiciousMeters(
  rows: StoredReading[],
  meterIds: MeterId[],
  period: string,
): SuspiciousMeterDetail[] {
  const monthly = monthlyMeterValues(rows, meterIds);
  const flagged: SuspiciousMeterDetail[] = [];

  for (const meterId of meterIds) {
    const valueAt = (p: string) => monthly.get(p)?.[meterId];

    const current = consumption(
      valueAt(period),
      valueAt(shiftPeriod(period, 1)),
    );
    if (current === null) continue;

    const priorConsumptions: number[] = [];
    for (let i = 1; i <= 3; i++) {
      const pFrom = shiftPeriod(period, i);
      const pTo = shiftPeriod(period, i + 1);
      const c = consumption(valueAt(pFrom), valueAt(pTo));
      if (c !== null && c > 0) priorConsumptions.push(c);
    }

    if (priorConsumptions.length < 3) continue;

    const avgPrior =
      priorConsumptions.reduce((a, b) => a + b, 0) / priorConsumptions.length;
    if (avgPrior <= 0) continue;

    if (current < avgPrior / SUSPICIOUS_RATIO_THRESHOLD) {
      flagged.push({
        meterId,
        meterLabel: METER_LABELS[meterId],
        currentConsumption: round3(current),
        avgPriorConsumption: round3(avgPrior),
        timesBelow: round3(avgPrior / current),
      });
    }
  }

  return flagged;
}

function round3(n: number): number {
  return Math.round(n * 1000) / 1000;
}

export function detectSuspiciousForReading(
  reading: StoredReading,
  allReadings: StoredReading[],
  meterIds: MeterId[],
): SuspiciousRecord | null {
  const period = periodKeyFromIso(reading.submittedAt);
  if (!period) return null;

  const history = allReadings.filter(
    (r) => r.slug === reading.slug && r.apartment === reading.apartment,
  );
  const meters = detectSuspiciousMeters(history, meterIds, period);
  if (meters.length === 0) return null;

  return {
    id: newId(),
    readingId: reading.id,
    slug: reading.slug,
    buildingTitle: reading.buildingTitle,
    apartment: reading.apartment,
    period,
    submittedAt: reading.submittedAt,
    meters,
  };
}

export async function appendSuspiciousRecord(
  record: SuspiciousRecord,
): Promise<void> {
  await mkdir(getDataDir(), { recursive: true });
  await appendFile(SUSPICIOUS_FILE, `${JSON.stringify(record)}\n`, "utf8");
}

export async function readAllSuspiciousRecords(): Promise<SuspiciousRecord[]> {
  try {
    const raw = await readFile(SUSPICIOUS_FILE, "utf8");
    if (!raw.trim()) return [];
    const rows: SuspiciousRecord[] = [];
    for (const line of raw.split("\n")) {
      const t = line.trim();
      if (!t) continue;
      try {
        rows.push(JSON.parse(t) as SuspiciousRecord);
      } catch {
        /* skip */
      }
    }
    return rows.sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
    );
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw e;
  }
}

/** Пересчёт по всей истории (для админки и после импорта старых данных). */
export async function rebuildSuspiciousIndex(
  meterIdsBySlug: (slug: string) => MeterId[],
): Promise<number> {
  const all = await readAllReadings();
  const seen = new Set<string>();
  const found: SuspiciousRecord[] = [];

  const groups = new Map<string, StoredReading[]>();
  for (const r of all) {
    const key = `${r.slug}\0${r.apartment}`;
    const list = groups.get(key) ?? [];
    list.push(r);
    groups.set(key, list);
  }

  for (const [, rows] of groups) {
    if (rows.length === 0) continue;
    const slug = rows[0]!.slug;
    const meterIds = meterIdsBySlug(slug);
    const periods = [
      ...new Set(
        rows
          .map((r) => periodKeyFromIso(r.submittedAt))
          .filter((p): p is string => Boolean(p)),
      ),
    ].sort();

    for (const period of periods) {
      const latestInMonth = [...rows]
        .filter((r) => periodKeyFromIso(r.submittedAt) === period)
        .sort(
          (a, b) =>
            new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
        )[0];
      if (!latestInMonth) continue;

      const dedupeKey = `${slug}\0${latestInMonth.apartment}\0${period}`;
      if (seen.has(dedupeKey)) continue;

      const record = detectSuspiciousForReading(latestInMonth, rows, meterIds);
      if (record) {
        seen.add(dedupeKey);
        found.push(record);
      }
    }
  }

  await mkdir(getDataDir(), { recursive: true });
  const { writeFile } = await import("node:fs/promises");
  const body = found.length
    ? `${found.map((r) => JSON.stringify(r)).join("\n")}\n`
    : "";
  await writeFile(SUSPICIOUS_FILE, body, "utf8");
  return found.length;
}

export { formatPeriodLabel };
