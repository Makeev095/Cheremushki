/**
 * Создаёт .env.local с READINGS_ADMIN_SECRET.
 * Запуск: node scripts/setup-local-env.mjs
 */
import { randomBytes } from "node:crypto";
import { writeFileSync, existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = join(root, ".env.local");

let existingAdmin = "";
if (existsSync(envPath)) {
  const cur = readFileSync(envPath, "utf8");
  const m = cur.match(/^READINGS_ADMIN_SECRET=(.*)$/m);
  if (m && m[1].trim()) existingAdmin = m[1].trim();
}

const adminSecret = existingAdmin || randomBytes(16).toString("hex");

const content = `# Сгенерировано scripts/setup-local-env.mjs

READINGS_ADMIN_SECRET=${adminSecret}
`;

writeFileSync(envPath, content, "utf8");

console.log("Создан/обновлён:", envPath);
console.log("\nАдминка показаний: http://localhost:3000/admin/readings");
console.log("Секрет:", adminSecret);
