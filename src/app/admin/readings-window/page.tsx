import type { Metadata } from "next";
import Link from "next/link";
import { AdminReadingsWindowForm } from "@/components/AdminReadingsWindowForm";
import { InnerPageSurface } from "@/components/InnerPageSurface";
import { requireAdmin } from "@/lib/require-admin";
import {
  getCalendarDayInTimeZone,
  isDefaultReadingsWindowOpen,
  resolveReadingsWindow,
  type ReadingsWindowOverride,
} from "@/lib/readings-window";
import { getReadingsWindowMode } from "@/lib/readings-window-storage";

export const metadata: Metadata = {
  title: "Окно показаний (тест)",
  robots: { index: false, follow: false },
};

export default async function AdminReadingsWindowPage() {
  await requireAdmin("/admin/readings-window");
  const secretConfigured = Boolean(process.env.READINGS_ADMIN_SECRET?.length);
  const override = await getReadingsWindowMode();
  const now = new Date();
  const moscowDay = getCalendarDayInTimeZone(now, "Europe/Moscow");
  const byRule = isDefaultReadingsWindowOpen(now, "Europe/Moscow");
  const effective = resolveReadingsWindow(override, now, "Europe/Moscow");

  const overrideLabel: Record<ReadingsWindowOverride, string> = {
    auto: "нет (по календарю)",
    open: "принудительно открыто",
    closed: "принудительно закрыто",
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <InnerPageSurface>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link
            href="/"
            className="font-medium text-emerald-800 hover:text-emerald-950"
          >
            ← На главную
          </Link>
          <Link
            href="/admin/readings"
            className="font-medium text-emerald-800 hover:text-emerald-950"
          >
            Показания и Excel
          </Link>
        </div>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-emerald-950">
        Настройки видимости формы показаний
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-emerald-900/85">
          
        </p>

        <dl className="mt-8 grid gap-3 rounded-2xl border border-emerald-900/10 bg-emerald-50/40 p-5 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-medium text-emerald-800">Сегодня (МСК)</dt>
            <dd className="mt-1 text-emerald-950">
              {now.toLocaleString("ru-RU", {
                timeZone: "Europe/Moscow",
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-emerald-800">Число месяца (МСК)</dt>
            <dd className="mt-1 font-semibold text-emerald-950">{moscowDay}</dd>
          </div>
          <div>
            <dt className="font-medium text-emerald-800">По правилам 20–24</dt>
            <dd className="mt-1 text-emerald-950">
              {byRule ? "форма открыта" : "форма закрыта"}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-emerald-800">Режим для всех посетителей</dt>
            <dd className="mt-1 text-emerald-950">{overrideLabel[override]}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="font-medium text-emerald-800">Итог на сайте для всех</dt>
            <dd className="mt-1 text-base font-semibold text-emerald-950">
              {effective === "open"
                ? "Показывается форма передачи показаний"
                : "Показывается уведомление (приём закрыт)"}
            </dd>
          </div>
        </dl>

        <div className="mt-10 border-t border-emerald-900/10 pt-8">
          <h2 className="text-lg font-semibold text-emerald-950">Управление</h2>
          <div className="mt-4">
            <AdminReadingsWindowForm secretConfigured={secretConfigured} />
          </div>
        </div>
      </InnerPageSurface>
    </main>
  );
}
