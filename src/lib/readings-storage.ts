import { mkdir, readFile, appendFile } from "node:fs/promises";
import path from "node:path";
import type { MeterId } from "@/data/meters";
import { METER_IDS } from "@/data/meters";

export interface StoredReading {
  id: string;
  slug: string;
  buildingTitle: string;
  apartment: string;
  readings: Partial<Record<MeterId, string>>;
  submittedAt: string;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "readings.jsonl");

async function ensureDataDir(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
}

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function appendReading(
  entry: Omit<StoredReading, "id">,
): Promise<StoredReading> {
  await ensureDataDir();
  const row: StoredReading = { ...entry, id: newId() };
  await appendFile(DATA_FILE, `${JSON.stringify(row)}\n`, "utf8");
  return row;
}

export async function readAllReadings(): Promise<StoredReading[]> {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    if (!raw.trim()) return [];
    const rows: StoredReading[] = [];
    for (const line of raw.split("\n")) {
      const t = line.trim();
      if (!t) continue;
      try {
        rows.push(JSON.parse(t) as StoredReading);
      } catch {
        /* пропуск битой строки */
      }
    }
    return rows.sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
    );
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw e;
  }
}

export async function readReadingsBySlug(slug: string): Promise<StoredReading[]> {
  const all = await readAllReadings();
  return all.filter((r) => r.slug === slug);
}

export async function countBySlug(): Promise<Record<string, number>> {
  const all = await readAllReadings();
  const counts: Record<string, number> = {};
  for (const r of all) {
    counts[r.slug] = (counts[r.slug] ?? 0) + 1;
  }
  return counts;
}

/** Строка для таблицы / Excel: фиксированный порядок счётчиков */
export function readingToRow(r: StoredReading): string[] {
  return [
    r.submittedAt,
    r.slug,
    r.buildingTitle,
    r.apartment,
    ...METER_IDS.map((id) => r.readings[id] ?? ""),
  ];
}

export const READINGS_TABLE_HEADERS = [
  "Дата и время (ISO)",
  "Код дома",
  "Дом",
  "Квартира",
  "ХВС",
  "ГВС",
  "Газ",
  "Тепло",
  "Электричество",
] as const;
