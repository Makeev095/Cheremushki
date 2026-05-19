"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLoginForm({
  secretConfigured,
  redirectTo = "/admin/readings",
  loginOnly = false,
}: {
  secretConfigured: boolean;
  redirectTo?: string;
  /** Только форма входа, без кнопки «Выйти» */
  loginOnly?: boolean;
}) {
  const router = useRouter();
  const [secret, setSecret] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    if (!secretConfigured) {
      setStatus("На сервере не настроен пароль админки.");
      return;
    }
    if (!secret.trim()) {
      setStatus("Введите пароль.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setStatus(data.error ?? "Неверный пароль");
        return;
      }
      setSecret("");
      router.push(redirectTo);
      router.refresh();
    } catch {
      setStatus("Сеть недоступна");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      router.push("/admin/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (!secretConfigured) {
    return (
      <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        На сервере не задан пароль админки (
        <code className="rounded bg-white px-1">READINGS_ADMIN_SECRET</code>
        ).
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block text-sm font-medium text-emerald-950">
        Пароль
        <input
          type="password"
          autoComplete="current-password"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          className="mt-2 w-full rounded-xl border border-emerald-900/15 bg-white px-4 py-2.5 text-emerald-950 outline-none ring-emerald-600/20 focus:ring-2"
          placeholder="Введите пароль"
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? "…" : "Войти"}
        </button>
        {!loginOnly && (
          <button
            type="button"
            disabled={loading}
            onClick={() => logout()}
            className="rounded-xl border border-emerald-800/30 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-900 hover:bg-emerald-50 disabled:opacity-50"
          >
            Выйти
          </button>
        )}
      </div>
      {status && (
        <p
          className={`text-sm font-medium ${status === "Вход выполнен." ? "text-emerald-800" : "text-red-700"}`}
          role="status"
        >
          {status}
        </p>
      )}
    </form>
  );
}
