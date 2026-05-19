import Image from "next/image";
import Link from "next/link";
import { SITE_TAGLINE } from "@/data/site";

export function SiteHeader() {
  return (
    <header className="border-b border-emerald-900/10 bg-white/90 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-3 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:py-4">
        <Link
          href="/"
          className="group flex w-full min-w-0 items-center justify-center gap-3 sm:w-auto sm:justify-start sm:gap-4"
        >
          <span className="inline-flex shrink-0 rounded-lg bg-white p-1 ring-1 ring-emerald-900/5">
            <Image
              src="/logo-cheremushki.png"
              alt="Черёмушки — управляющая компания"
              width={120}
              height={120}
              className="h-14 w-auto object-contain mix-blend-multiply contrast-[1.02] sm:h-16"
              priority
            />
          </span>
          <span className="flex min-w-0 flex-col justify-center border-l border-emerald-900/15 pl-3 sm:max-w-md sm:pl-4">
            <span className="text-lg font-bold leading-tight tracking-tight text-emerald-950 group-hover:text-emerald-800 sm:text-xl">
              ООО «УК Черёмушки»
            </span>
            {SITE_TAGLINE ? (
              <span className="mt-1 text-sm font-normal leading-snug text-emerald-800/90">
                {SITE_TAGLINE}
              </span>
            ) : null}
          </span>
        </Link>
        <nav className="flex w-full flex-wrap items-center justify-center gap-0.5 text-sm font-medium text-emerald-900/90 sm:w-auto sm:justify-end">
          <Link
            href="/#grafik"
            className="min-h-11 rounded-lg px-3 py-2.5 hover:bg-emerald-50 hover:text-emerald-950 sm:min-h-0 sm:py-2"
          >
            График
          </Link>
          <Link
            href="/#kontakty"
            className="min-h-11 rounded-lg px-3 py-2.5 hover:bg-emerald-50 hover:text-emerald-950 sm:min-h-0 sm:py-2"
          >
            Контакты
          </Link>
          <Link
            href="/admin/login"
            className="min-h-11 rounded-lg px-3 py-2.5 text-emerald-800/80 hover:bg-emerald-50 hover:text-emerald-950 sm:min-h-0 sm:py-2"
          >
            Войти
          </Link>
        </nav>
      </div>
    </header>
  );
}
