import {
  getAllBuildings,
  getBuildingBySlug,
  type Building,
} from "@/data/buildings";

/** Путь как на старом сайте: bulgakova_5, strelkovoy_divizii_19_korpus_1 */
export function slugToLegacyPath(slug: string): string {
  return slug.replace(/-/g, "_");
}

export function legacyPathToSlug(legacyPath: string): string {
  return legacyPath.trim().replace(/_/g, "-");
}

/** Сегменты URL, которые не являются страницами домов */
export const RESERVED_ROOT_SEGMENTS = new Set([
  "admin",
  "api",
  "dom",
  "otopitelniy_sezon",
  "otopitelniy_sezon2026-2027",
  "_next",
]);

export function getBuildingByLegacyPath(
  legacyPath: string,
): Building | undefined {
  const normalized = legacyPath.trim().toLowerCase();
  if (!normalized || RESERVED_ROOT_SEGMENTS.has(normalized)) {
    return undefined;
  }
  return getBuildingBySlug(legacyPathToSlug(normalized));
}

export function getAllLegacyPaths(): { legacyPath: string; slug: string }[] {
  return getAllBuildings().map((b) => ({
    legacyPath: slugToLegacyPath(b.slug),
    slug: b.slug,
  }));
}

export function legacyPathForBuilding(building: Building): string {
  return slugToLegacyPath(building.slug);
}
