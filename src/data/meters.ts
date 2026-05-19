export const METER_IDS = [
  "cold_water",
  "hot_water",
  "gas",
  "heat",
  "electricity",
] as const;

export type MeterId = (typeof METER_IDS)[number];

export const METER_LABELS: Record<MeterId, string> = {
  cold_water: "Холодное водоснабжение",
  hot_water: "Горячее водоснабжение",
  gas: "Газоснабжение",
  heat: "Тепловая энергия",
  electricity: "Электроэнергия",
};

export function isMeterId(value: string): value is MeterId {
  return (METER_IDS as readonly string[]).includes(value);
}
