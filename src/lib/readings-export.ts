import * as XLSX from "xlsx";
import { getAllBuildings } from "@/data/buildings";
import { filterReadingsByPeriod } from "@/lib/readings-period";
import {
  readAllReadings,
  readReadingsBySlug,
  READINGS_TABLE_HEADERS,
  readingToRow,
  type StoredReading,
} from "@/lib/readings-storage";

function sanitizeSheetName(name: string): string {
  const s = name.replace(/[\\/?*[\]:]/g, " ").trim();
  return (s.length > 31 ? s.slice(0, 31) : s) || "Дом";
}

function sheetFromReadings(rows: StoredReading[]): XLSX.WorkSheet {
  const data = [
    [...READINGS_TABLE_HEADERS],
    ...rows.map((r) => readingToRow(r)),
  ];
  return XLSX.utils.aoa_to_sheet(data);
}

function periodFilePart(period: string | null): string {
  if (!period) return "vse";
  return period;
}

export async function buildWorkbookForSlug(
  slug: string,
  period: string | null,
): Promise<{ buffer: Buffer; filename: string }> {
  const buildings = getAllBuildings();
  const building = buildings.find((b) => b.slug === slug);
  if (!building) throw new Error("UNKNOWN_BUILDING");

  const rows = filterReadingsByPeriod(await readReadingsBySlug(slug), period);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    wb,
    sheetFromReadings(rows),
    sanitizeSheetName(building.title),
  );

  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
  return {
    buffer,
    filename: `pokazaniya-${slug}-${periodFilePart(period)}.xlsx`,
  };
}

export async function buildWorkbookAll(
  period: string | null,
): Promise<{ buffer: Buffer; filename: string }> {
  const all = filterReadingsByPeriod(await readAllReadings(), period);
  const wb = XLSX.utils.book_new();
  const buildings = getAllBuildings();
  const usedNames = new Set<string>();

  for (const building of buildings) {
    const rows = all.filter((r) => r.slug === building.slug);
    if (rows.length === 0) continue;

    let sheetName = sanitizeSheetName(building.title);
    let n = 2;
    while (usedNames.has(sheetName)) {
      const suffix = ` ${n}`;
      sheetName = sanitizeSheetName(
        building.title.slice(0, 31 - suffix.length) + suffix,
      );
      n++;
    }
    usedNames.add(sheetName);
    XLSX.utils.book_append_sheet(wb, sheetFromReadings(rows), sheetName);
  }

  if (wb.SheetNames.length === 0) {
    XLSX.utils.book_append_sheet(wb, sheetFromReadings([]), "Показания");
  }

  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
  const part = period ? periodFilePart(period) : "vse-doma";
  return {
    buffer,
    filename: `pokazaniya-${part}.xlsx`,
  };
}
