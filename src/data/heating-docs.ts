/**
 * Документы отопительного сезона.
 * PDF в `public/docs/`, ссылки на сайте: `/docs/<file>`.
 */
export type HeatingDocument = {
  title: string;
  /** имя файла в каталоге public/docs */
  file: string;
};

/** Сезон 2025–2026 → /otopitelniy_sezon */
export const HEATING_SEASON_DOCS: HeatingDocument[] = [
  {
    title: "План подготовки к отопительному сезону 2025–2026 гг. (ул.)",
    file: "plan-otopitelnyj-2025-2026-ul.pdf",
  },
  {
    title:
      "План подготовки к отопительному сезону 2025–2026 гг. (ул. Подстанционная)",
    file: "plan-otopitelnyj-2025-2026-podstancionnaya.pdf",
  },
  {
    title: "Документ от 24.04.2025",
    file: "doc-20250424-wa0004.pdf",
  },
];

/** Сезон 2026–2027 → /otopitelniy_sezon2026-2027 */
export const HEATING_SEASON_2026_DOCS: HeatingDocument[] = [
  {
    title: "Отопительный сезон 2026–2027",
    file: "otopitelnyj-sezon-2026-2027.pdf",
  },
];
