import { mkdir, readFile, writeFile } from "node:fs/promises";
import {
  parseReadingsOverrideCookie,
  type ReadingsWindowOverride,
} from "@/lib/readings-window";
import { dataFilePath, getDataDir } from "@/lib/data-dir";

const SETTINGS_FILE = dataFilePath("readings-window.json");

interface StoredReadingsWindowSettings {
  mode: ReadingsWindowOverride;
  updatedAt: string;
}

async function ensureDataDir(): Promise<void> {
  await mkdir(getDataDir(), { recursive: true });
}

/** Режим видимости формы для всех посетителей сайта. */
export async function getReadingsWindowMode(): Promise<ReadingsWindowOverride> {
  try {
    const raw = await readFile(SETTINGS_FILE, "utf8");
    const data = JSON.parse(raw) as Partial<StoredReadingsWindowSettings>;
    return parseReadingsOverrideCookie(data.mode);
  } catch {
    return "auto";
  }
}

export async function setReadingsWindowMode(
  mode: ReadingsWindowOverride,
): Promise<StoredReadingsWindowSettings> {
  await ensureDataDir();
  const stored: StoredReadingsWindowSettings = {
    mode,
    updatedAt: new Date().toISOString(),
  };
  await writeFile(SETTINGS_FILE, `${JSON.stringify(stored)}\n`, "utf8");
  return stored;
}
