/** URL выгрузки Excel (slug = один дом, period = YYYY-MM или все). */
export function readingsExportHref(options: {
  slug?: string;
  period?: string | null;
}): string {
  const p = new URLSearchParams();
  if (options.slug) p.set("slug", options.slug);
  const period = options.period;
  if (period && period !== "all") p.set("period", period);
  const q = p.toString();
  return `/api/admin/readings/export${q ? `?${q}` : ""}`;
}
