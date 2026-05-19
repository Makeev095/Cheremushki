import Link from "next/link";
import { HERO_COMPANY_INTRO } from "@/data/site";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-3 py-8 sm:px-6 sm:py-16">
      <section className="relative overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/10 sm:rounded-3xl">
        <div
          className="absolute inset-0 bg-[url('/hero-eagle.png')] bg-cover bg-[center_42%] sm:bg-[center_35%]"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/55 to-sky-950/30"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-slate-900/25 sm:from-slate-950/75 sm:via-transparent sm:to-slate-900/15"
          aria-hidden
        />

        <div className="relative flex min-h-[min(70vh,520px)] flex-col justify-end px-4 pb-8 pt-24 sm:min-h-[min(72vh,620px)] sm:justify-center sm:px-10 sm:pb-16 sm:pt-20 lg:px-14">
          <div className="max-w-xl text-center sm:ml-auto sm:text-right">
            <h1 className="text-[1.65rem] font-bold leading-[1.12] tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-4xl lg:text-[2.75rem]">
              ООО «УК Черёмушки»
            </h1>
            <p className="mx-auto mt-4 max-w-md text-xl font-semibold leading-snug text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] sm:mt-5 sm:ml-auto sm:max-w-lg sm:text-2xl sm:leading-relaxed lg:text-[1.85rem]">
              {HERO_COMPANY_INTRO}
            </p>
          </div>
        </div>
      </section>

      <div className="mt-10 grid gap-8 sm:mt-14 sm:gap-10 lg:grid-cols-2">
        <section
          id="grafik"
          className="scroll-mt-24 rounded-2xl border border-emerald-900/10 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-8"
        >
          <h2 className="text-xl font-semibold text-emerald-950">
            График работы
          </h2>
          <ul className="mt-6 space-y-3 text-emerald-900/90">
            <li>
              <span className="font-medium text-emerald-950">Понедельник:</span>{" "}
              9:00 — 17:00
            </li>
            <li>
              <span className="font-medium text-emerald-950">Вторник:</span>{" "}
              9:00 — 19:00
            </li>
            <li>
              <span className="font-medium text-emerald-950">Среда:</span>{" "}
              9:00 — 17:00
            </li>
            <li>
              <span className="font-medium text-emerald-950">Четверг:</span>{" "}
              9:00 — 17:00
            </li>
            <li>
              <span className="font-medium text-emerald-950">Пятница:</span>{" "}
              9:00 — 16:00
            </li>
            <li>
              <span className="font-medium text-emerald-950">Суббота:</span>{" "}
              выходной
            </li>
            <li>
              <span className="font-medium text-emerald-950">Воскресенье:</span>{" "}
              выходной
            </li>
          </ul>
          <p className="mt-6 text-sm text-emerald-800/85">
            <span className="font-medium text-emerald-950">Перерыв:</span>{" "}
            12:00 — 13:00
          </p>
          <p className="mt-2 text-sm text-emerald-800/85">
            <span className="font-medium text-emerald-950">Приёмные часы:</span>{" "}
            вторник 16:00 — 19:00
          </p>
        </section>

        <section
          id="kontakty"
          className="scroll-mt-24 rounded-2xl border border-emerald-900/10 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-8"
        >
          <h2 className="text-xl font-semibold text-emerald-950">Контакты</h2>
          <dl className="mt-6 space-y-5 text-emerald-900/90">
            <div>
              <dt className="text-sm font-medium text-emerald-800">Email</dt>
              <dd>
                <a
                  className="text-emerald-950 underline decoration-emerald-300 underline-offset-2 hover:decoration-emerald-600"
                  href="mailto:uk.cheremushki@gmail.com"
                >
                  uk.cheremushki@gmail.com
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-emerald-800">Офис</dt>
              <dd>
                <a
                  className="font-medium text-emerald-950 hover:text-emerald-800"
                  href="tel:+78793381580"
                >
                  +7 (8793) 38-15-80
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-emerald-800">
                Аварийная служба (круглосуточно)
              </dt>
              <dd>
                <a
                  className="font-medium text-emerald-950 hover:text-emerald-800"
                  href="tel:+79288256186"
                >
                  +7 (928) 825-61-86
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-emerald-800">Адрес</dt>
              <dd>г. Пятигорск, ул. Булгакова, 19</dd>
            </div>
          </dl>
        </section>
      </div>

      <section className="mt-10 rounded-2xl border border-emerald-900/10 bg-white p-5 shadow-sm sm:mt-14 sm:rounded-3xl sm:p-8">
        <h2 className="text-xl font-semibold text-emerald-950">
          Мероприятия по подготовке к отопительному сезону
        </h2>
        <p className="mt-2 text-sm text-emerald-800/85">
          
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/otopitelniy_sezon"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-emerald-800 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 sm:w-auto"
          >
            Сезон 2025 - 2026
          </Link>
          <Link
            href="/otopitelniy_sezon2026-2027"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-emerald-900/15 bg-emerald-50/50 px-5 py-3 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50 sm:w-auto"
          >
            Сезон 2026 — 2027
          </Link>
        </div>
      </section>
    </main>
  );
}
