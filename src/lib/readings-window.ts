export type ReadingsWindowOverride = "auto" | "open" | "closed";

/** Приём показаний по умолчанию: 20–24 число включительно, календарь Москвы. */
export const READINGS_WINDOW_START_DAY = 20;
export const READINGS_WINDOW_END_DAY = 24;

const COOKIE_NAME = "readings_window_override";

export function parseReadingsOverrideCookie(
  raw: string | undefined,
): ReadingsWindowOverride {
  if (raw === "open" || raw === "closed" || raw === "auto") return raw;
  return "auto";
}

export function readingsOverrideCookieName(): string {
  return COOKIE_NAME;
}

/** Число календарного дня в указанной таймзоне (для Москвы — местные сутки жителя). */
export function getCalendarDayInTimeZone(
  date: Date,
  timeZone: string,
): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    day: "numeric",
  }).formatToParts(date);
  const day = parts.find((p) => p.type === "day")?.value;
  const n = day ? parseInt(day, 10) : NaN;
  if (!Number.isFinite(n)) {
    throw new Error("Invalid calendar day");
  }
  return n;
}

export function isDefaultReadingsWindowOpen(
  now: Date = new Date(),
  timeZone = "Europe/Moscow",
): boolean {
  const day = getCalendarDayInTimeZone(now, timeZone);
  return (
    day >= READINGS_WINDOW_START_DAY && day <= READINGS_WINDOW_END_DAY
  );
}

export function resolveReadingsWindow(
  override: ReadingsWindowOverride,
  now: Date = new Date(),
  timeZone = "Europe/Moscow",
): "open" | "closed" {
  if (override === "open") return "open";
  if (override === "closed") return "closed";
  return isDefaultReadingsWindowOpen(now, timeZone) ? "open" : "closed";
}
