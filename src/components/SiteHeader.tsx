import Image from "next/image";
import Link from "next/link";
import { SITE_TAGLINE } from "@/data/site";

export function SiteHeader() {
  return (
    <header className="border-b border-emerald-900/10 bg-white/90 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
        <Link
          href="/"
          className="group flex items-center gap-3 sm:gap-4"
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
          <span className="flex max-w-[min(100%,20rem)] flex-col border-l border-emerald-900/10 pl-3 sm:max-w-md sm:pl-4">
            <span className="text-base font-semibold leading-tight tracking-tight text-emerald-950 group-hover:text-emerald-800 sm:text-lg">
              ООО «УК Черёмушки»
            </span>
            <span className="mt-1.5 text-xs font-normal leading-snug text-emerald-800/90 sm:text-sm">
              {SITE_TAGLINE}
            </span>
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-1 text-sm font-medium text-emerald-900/90">
          <Link
            href="/#grafik"
            className="rounded-lg px-3 py-2 hover:bg-emerald-50 hover:text-emerald-950"
          >
            График
          </Link>
          <Link
            href="/#kontakty"
            className="rounded-lg px-3 py-2 hover:bg-emerald-50 hover:text-emerald-950"
          >
            Контакты
          </Link>
          <Link
            href="/admin/login"
            className="rounded-lg px-3 py-2 text-emerald-800/80 hover:bg-emerald-50 hover:text-emerald-950"
          >
            Войти
          </Link>
        </nav>
      </div>
    </header>
  );
}
