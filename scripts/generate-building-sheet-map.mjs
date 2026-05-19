/**
 * Генерирует BUILDING_SHEET_MAP для Google Apps Script (режим одной таблицы).
 * Запуск: node scripts/generate-building-sheet-map.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "src/data/buildings.ts"), "utf8");

const map = {};
const re =
  /slug:\s*"([^"]+)"[\s\S]*?title:\s*"((?:[^"\\]|\\.)*)"/g;
let m;
while ((m = re.exec(src)) !== null) {
  map[m[1]] = m[2];
}

const outPath = join(root, "scripts/building-sheet-map.json");
writeFileSync(outPath, JSON.stringify(map, null, 2) + "\n", "utf8");

const oneLine = JSON.stringify(map);
console.log("Записано:", outPath);
console.log("\n--- BUILDING_SHEET_MAP (одна строка для Script Properties) ---\n");
console.log(oneLine);
console.log("\n--- Всего домов:", Object.keys(map).length, "---\n");
