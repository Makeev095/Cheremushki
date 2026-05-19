import {
  getAllBuildings,
  getBuildingBySlug,
  type Building,
} from "@/data/buildings";
import legacyOverrides from "@/data/legacy-path-overrides.json";

const LEGACY_PATH_BY_SLUG = legacyOverrides.bySlug as Record<string, string>;
const LEGACY_PATH_ALIASES = legacyOverrides.aliases as Record<string, string>;

/** Путь как на cheremushki.online: bulgakova_5, bulgakova_17/1, podstancionnaya_22_a */
export function slugToLegacyPath(slug: string): string {
  return LEGACY_PATH_BY_SLUG[slug] ?? slug.replace(/-/g, "_");
}

export function normalizeLegacyPath(path: string): string {
  return path.trim().toLowerCase().replace(/^\/+|\/+$/g, "");
}

const pathToSlug = new Map<string, string>();

function registerPath(path: string, slug: string) {
  pathToSlug.set(normalizeLegacyPath(path), slug);
}

for (const building of getAllBuildings()) {
  registerPath(slugToLegacyPath(building.slug), building.slug);
}

for (const [aliasPath, slug] of Object.entries(LEGACY_PATH_ALIASES)) {
  registerPath(aliasPath, slug);
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
  const normalized = normalizeLegacyPath(legacyPath);
  if (!normalized) return undefined;

  const root = normalized.split("/")[0];
  if (RESERVED_ROOT_SEGMENTS.has(root)) return undefined;

  const slug = pathToSlug.get(normalized);
  if (slug) return getBuildingBySlug(slug);

  return undefined;
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
