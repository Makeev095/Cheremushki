"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Mode = "auto" | "open" | "closed";

export function AdminReadingsWindowForm({
  secretConfigured,
}: {
  secretConfigured: boolean;
}) {
  const router = useRouter();
  const [secret, setSecret] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(mode: Mode) {
    setStatus(null);
    if (!secretConfigured) {
      setStatus("На сервере не задан READINGS_ADMIN_SECRET.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/readings-window", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret, mode }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setStatus(data.error ?? "Ошибка запроса");
        return;
      }
      setSecret("");
      setStatus(
        mode === "auto"
          ? "Режим для всех: автоматически по дате (20–24)."
          : mode === "open"
            ? "Режим для всех: только форма показаний."
            : "Режим для всех: только уведомление (приём закрыт).",
      );
      router.refresh();
    } catch {
      setStatus("Сеть недоступна");
    } finally {
      setLoading(false);
    }
  }

  if (!secretConfigured) {
    return (
      <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        Добавьте в <code className="rounded bg-white px-1">.env.local</code>{" "}
        переменную{" "}
        <code className="rounded bg-white px-1">READINGS_ADMIN_SECRET</code> и
        перезапустите сервер — тогда панель станет доступна.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-emerald-950">
        Пароль администратора
        <input
          type="password"
          autoComplete="off"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          className="mt-2 w-full max-w-md rounded-xl border border-emerald-900/15 bg-white px-4 py-2.5 text-emerald-950 outline-none ring-emerald-600/20 focus:ring-2"
          placeholder="READINGS_ADMIN_SECRET"
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={loading}
          onClick={() => submit("auto")}
          className="rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
        >
          Автоматическое закрытие и открытие
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => submit("open")}
          className="rounded-xl border border-emerald-800/30 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-900 hover:bg-emerald-50 disabled:opacity-50"
        >
          Отображать только форму показаний
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => submit("closed")}
          className="rounded-xl border border-amber-700/40 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-950 hover:bg-amber-100 disabled:opacity-50"
        >
          Запретить передачу показаний
        </button>
      </div>
      {status && (
        <p className="text-sm font-medium text-emerald-800" role="status">
          {status}
        </p>
      )}
    </div>
  );
}
