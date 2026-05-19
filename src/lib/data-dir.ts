import path from "node:path";

/** Единая папка данных на сервере (показания, настройки окна, подозрительные). */
export function getDataDir(): string {
  const fromEnv = process.env.READINGS_DATA_DIR?.trim();
  if (fromEnv) return path.resolve(fromEnv);
  return path.join(process.cwd(), ".data");
}

export function dataFilePath(name: string): string {
  return path.join(getDataDir(), name);
}
