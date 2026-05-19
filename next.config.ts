import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";
import legacyOverrides from "./src/data/legacy-path-overrides.json";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

const legacyPathBySlug = legacyOverrides.bySlug as Record<string, string>;
const legacyPathAliases = legacyOverrides.aliases as Record<string, string>;

function canonicalLegacyPath(slug: string): string {
  return legacyPathBySlug[slug] ?? slug.replace(/-/g, "_");
}

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: rootDir,
  },
  async redirects() {
    return Object.entries(legacyPathAliases)
      .map(([aliasPath, slug]) => {
        const canonical = canonicalLegacyPath(slug);
        if (aliasPath.toLowerCase() === canonical.toLowerCase()) return null;
        return {
          source: `/${aliasPath}`,
          destination: `/${canonical}`,
          permanent: true,
        };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null);
  },
};

export default nextConfig;
