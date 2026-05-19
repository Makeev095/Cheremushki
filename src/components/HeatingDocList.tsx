import Link from "next/link";
import type { HeatingDocument } from "@/data/heating-docs";

export function HeatingDocList({ docs }: { docs: HeatingDocument[] }) {
  if (docs.length === 0) {
    return (
      <p className="rounded-2xl border border-emerald-900/15 bg-emerald-50/50 px-5 py-6 text-sm leading-relaxed text-emerald-900/85">
        Пока здесь нет загруженных файлов. Как только документы будут готовы,
        мы опубликуем их на этой странице.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {docs.map((d) => (
        <li key={d.file}>
          <Link
            href={`/docs/${encodeURIComponent(d.file)}`}
            className="flex items-center justify-between gap-4 rounded-2xl border border-emerald-900/10 bg-white px-5 py-4 text-sm font-medium text-emerald-950 shadow-sm transition hover:border-emerald-700/25 hover:bg-emerald-50/50"
          >
            <span>{d.title}</span>
            <span className="shrink-0 text-emerald-700">PDF →</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
