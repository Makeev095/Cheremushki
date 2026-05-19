import type { Metadata } from "next";
import Link from "next/link";
import { HeatingDocList } from "@/components/HeatingDocList";
import { InnerPageSurface } from "@/components/InnerPageSurface";
import { HEATING_SEASON_DOCS } from "@/data/heating-docs";

export const metadata: Metadata = {
  title: "Отопительный сезон 2025–2026",
  description:
    "Документы ООО «УК Черёмушки» по подготовке к отопительному сезону 2025–2026.",
};

export default function HeatingSeasonPage() {
  return (
    <main className="mx-auto max-w-3xl px-3 py-8 sm:px-6 sm:py-14">
      <InnerPageSurface>
        <Link
          href="/"
          className="text-sm font-medium text-emerald-800 hover:text-emerald-950"
        >
          ← На главную
        </Link>
        <h1 className="mt-5 text-2xl font-bold leading-tight tracking-tight text-emerald-950 sm:mt-6 sm:text-3xl">
          Подготовка к отопительному сезону 2025–2026
        </h1>
        <p className="mt-4 text-base leading-relaxed text-emerald-900/85">
          
        </p>
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-emerald-950">Документы</h2>
          <div className="mt-4">
            <HeatingDocList docs={HEATING_SEASON_DOCS} />
          </div>
        </section>
      </InnerPageSurface>
    </main>
  );
}
