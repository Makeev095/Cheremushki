import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-emerald-900/10 bg-emerald-950 text-emerald-100">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex justify-center">
          <Image
            src="/logo-cheremushki.png"
            alt="Черёмушки — управляющая компания"
            width={200}
            height={120}
            className="h-14 w-auto object-contain opacity-95 brightness-0 invert sm:h-16"
          />
        </div>
        <p className="text-center text-sm text-emerald-200/90">
          2012 — {new Date().getFullYear()} · Все права защищены · ООО «УК
          Черёмушки»
        </p>
        <p className="mt-1 text-center text-xs text-emerald-300/70">
          Copyright 2012 — {new Date().getFullYear()}, ООО «УК Черёмушки»
        </p>
      </div>
    </footer>
  );
}
