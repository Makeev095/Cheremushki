import type { MeterId } from "./meters";

export interface Building {
  slug: string;
  title: string;
  addressLine: string;
  /** Счётчики, которые показываются на странице дома (порядок = порядок колонок в таблице). */
  meters: MeterId[];
  /**
   * ID Google Таблицы (из URL). На проде соответствие slug → id задаётся в Apps Script;
   * здесь поле для документации и локальной проверки — подставьте реальные ID.
   */
  spreadsheetId?: string;
}

export const BUILDINGS: Building[] = [
  {
    slug: "bulgakova-2",
    title: "Булгакова, 2",
    addressLine: "г. Пятигорск, ул. Булгакова, д. 2",
    meters: ["cold_water", "gas"],
  },
  {
    slug: "bulgakova-3",
    title: "Булгакова, 3",
    addressLine: "г. Пятигорск, ул. Булгакова, д. 3",
    meters: ["cold_water"],
  },
  {
    slug: "bulgakova-5",
    title: "Булгакова, 5",
    addressLine: "г. Пятигорск, ул. Булгакова, д. 5",
    meters: ["cold_water"],
  },
  {
    slug: "bulgakova-7",
    title: "Булгакова, 7",
    addressLine: "г. Пятигорск, ул. Булгакова, д. 7",
    meters: ["cold_water"],
  },
  {
    slug: "bulgakova-9",
    title: "Булгакова, 9",
    addressLine: "г. Пятигорск, ул. Булгакова, д. 9",
    meters: ["hot_water", "gas", "heat"],
  },
  {
    slug: "bulgakova-13",
    title: "Булгакова, 13",
    addressLine: "г. Пятигорск, ул. Булгакова, д. 13",
    meters: ["hot_water", "gas", "heat"],
  },
  {
    slug: "bulgakova-15",
    title: "Булгакова, 15",
    addressLine: "г. Пятигорск, ул. Булгакова, д. 15",
    meters: ["cold_water", "gas"],
  },
  {
    slug: "bulgakova-17",
    title: "Булгакова, 17",
    addressLine: "г. Пятигорск, ул. Булгакова, д. 17",
    meters: ["cold_water", "gas"],
  },
  {
    slug: "bulgakova-17-korpus-1",
    title: "Булгакова, 17, корпус 1",
    addressLine: "г. Пятигорск, ул. Булгакова, д. 17, корпус 1",
    meters: ["cold_water", "gas"],
  },
  {
    slug: "bulgakova-19",
    title: "Булгакова, 19",
    addressLine: "г. Пятигорск, ул. Булгакова, д. 19",
    meters: ["cold_water", "gas"],
  },
  {
    slug: "dzerzhinskogo-57",
    title: "Дзержинского, 57",
    addressLine: "г. Пятигорск, ул. Дзержинского, д. 57",
    meters: ["cold_water", "gas"],
  },
  {
    slug: "oranjereynaya-22-korpus-2",
    title: "Оранжерейная, 22, корпус 2",
    addressLine: "г. Пятигорск, ул. Оранжерейная, д. 22, корпус 2",
    meters: ["cold_water"],
  },
  {
    slug: "podstancionnaya-22a",
    title: "Подстанционная, 22А",
    addressLine: "г. Пятигорск, ул. Подстанционная, д. 22А",
    meters: ["cold_water", "hot_water", "heat", "electricity"],
  },
  {
    slug: "universitetskaya-34",
    title: "Университетская, 34",
    addressLine: "г. Пятигорск, ул. Университетская, д. 34",
    meters: ["cold_water", "hot_water", "electricity"],
  },
  {
    slug: "universitetskaya-36a",
    title: "Университетская, 36А",
    addressLine: "г. Пятигорск, ул. Университетская, д. 36А",
    meters: ["cold_water", "hot_water"],
  },
  {
    slug: "strelkovoy-divizii-13-korpus-2",
    title: "ул. 295 Стрелковой Дивизии, 13, корпус 2",
    addressLine: "г. Пятигорск, ул. 295 Стрелковой Дивизии, д. 13, корпус 2",
    meters: ["cold_water", "hot_water", "electricity"],
  },
  {
    slug: "strelkovoy-divizii-19-korpus-1",
    title: "ул. 295 Стрелковой Дивизии, 19, корпус 1",
    addressLine: "г. Пятигорск, ул. 295 Стрелковой Дивизии, д. 19, корпус 1",
    meters: ["cold_water", "electricity"],
  },
  {
    slug: "strelkovoy-divizii-19-korpus-2",
    title: "ул. 295 Стрелковой Дивизии, 19, корпус 2",
    addressLine: "г. Пятигорск, ул. 295 Стрелковой Дивизии, д. 19, корпус 2",
    meters: ["cold_water", "electricity"],
  },
  {
    slug: "strelkovoy-divizii-19-korpus-3",
    title: "ул. 295 Стрелковой Дивизии, 19, корпус 3",
    addressLine: "г. Пятигорск, ул. 295 Стрелковой Дивизии, д. 19, корпус 3",
    meters: ["cold_water", "electricity"],
  },
  {
    slug: "strelkovoy-divizii-19-korpus-4",
    title: "ул. 295 Стрелковой Дивизии, 19, корпус 4",
    addressLine: "г. Пятигорск, ул. 295 Стрелковой Дивизии, д. 19, корпус 4",
    meters: ["cold_water", "electricity"],
  },
  {
    slug: "strelkovoy-divizii-19-korpus-5",
    title: "ул. 295 Стрелковой Дивизии, 19, корпус 5",
    addressLine: "г. Пятигорск, ул. 295 Стрелковой Дивизии, д. 19, корпус 5",
    meters: ["cold_water", "electricity"],
  },
  {
    slug: "tolyatti-36-1",
    title: "Тольятти 36/1",
    addressLine: "г. Пятигорск, ул. Тольятти 36/1",
    meters: ["gas"],
  },
];

const bySlug = new Map(BUILDINGS.map((b) => [b.slug, b]));

export function getBuildingBySlug(slug: string): Building | undefined {
  return bySlug.get(slug);
}

export function getAllBuildings(): Building[] {
  return BUILDINGS;
}
