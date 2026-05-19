import type { Metadata } from "next";
import Link from "next/link";
import { HeatingDocList } from "@/components/HeatingDocList";
import { InnerPageSurface } from "@/components/InnerPageSurface";
import { HEATING_SEASON_2026_DOCS } from "@/data/heating-docs";

export const metadata: Metadata = {
  title: "Сезон 2026–2027",
  description:
    "Материалы ООО «УК Черёмушки» по подготовке к отопительному сезону 2026–2027.",
};

export default function HeatingSeason2026Page() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <InnerPageSurface>
        <Link
          href="/"
          className="text-sm font-medium text-emerald-800 hover:text-emerald-950"
        >
          ← На главную
        </Link>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-emerald-950">
          Подготовка к отопительному сезону 2026–2027
        </h1>
        <p className="mt-4 text-base leading-relaxed text-emerald-900/85">
          
        </p>
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-emerald-950">Документы</h2>
          <div className="mt-4">
            <HeatingDocList docs={HEATING_SEASON_2026_DOCS} />
          </div>
        </section>
      </InnerPageSurface>
    </main>
  );
}
