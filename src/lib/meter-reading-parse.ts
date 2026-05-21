import type { MeterId } from "@/data/meters";

const WATER_METERS: ReadonlySet<MeterId> = new Set(["cold_water", "hot_water"]);

export function isWaterMeter(meterId: MeterId): boolean {
  return WATER_METERS.has(meterId);
}

/** ХВС/ГВС — любой непустой текст; остальные счётчики — неотрицательное число. */
export function parseMeterReading(
  raw: string,
  meterId: MeterId,
): { ok: true; value: string } | { ok: false } {
  const t = raw.trim();
  if (t === "") return { ok: false };

  if (isWaterMeter(meterId)) {
    if (t.length > 64) return { ok: false };
    return { ok: true, value: t };
  }

  const normalized = t.replace(",", ".");
  const n = Number(normalized);
  if (!Number.isFinite(n) || n < 0 || n > 1_000_000_000) return { ok: false };
  return { ok: true, value: normalized };
}
