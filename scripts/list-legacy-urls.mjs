/**
 * Полный список URL домов (как на cheremushki.online).
 * node scripts/list-legacy-urls.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "src/data/buildings.ts"), "utf8");
const overrides = JSON.parse(
  readFileSync(join(root, "src/data/legacy-path-overrides.json"), "utf8"),
);

const rows = [];
const re =
  /slug:\s*"([^"]+)"[\s\S]*?title:\s*"((?:[^"\\]|\\.)*)"/g;
let m;
while ((m = re.exec(src)) !== null) {
  const slug = m[1];
  const title = m[2];
  const legacyPath =
    overrides.bySlug[slug] ?? slug.replace(/-/g, "_");
  rows.push({ slug, legacyPath, title });
}

const domain = "https://cheremushki.online";
const lines = [
  "# URL страниц показаний (все дома)",
  "",
  `Всего: **${rows.length}**`,
  "",
  "| Дом | Ссылка |",
  "|-----|--------|",
  ...rows.map(
    (r) => `| ${r.title} | [/${r.legacyPath}](${domain}/${r.legacyPath}) |`,
  ),
  "",
];

const out = join(root, "LEGACY-URLS.md");
writeFileSync(out, lines.join("\n"), "utf8");
console.log("Записано:", out);
console.log("\nПримеры:");
for (const r of rows.slice(0, 3)) {
  console.log(`  ${domain}/${r.legacyPath}`);
}
