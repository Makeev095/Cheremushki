"use client";

import { useState } from "react";
import type { Building } from "@/data/buildings";
import { METER_LABELS, type MeterId } from "@/data/meters";

type Status = "idle" | "loading" | "success" | "error";

function parseReading(raw: string): { ok: true; value: string } | { ok: false } {
  const t = raw.trim().replace(",", ".");
  if (t === "") return { ok: false };
  const n = Number(t);
  if (!Number.isFinite(n) || n < 0) return { ok: false };
  if (n > 1_000_000_000) return { ok: false };
  return { ok: true, value: t };
}

export function MeterReadingsForm({ building }: { building: Building }) {
  const [apartment, setApartment] = useState("");
  const [values, setValues] = useState<Partial<Record<MeterId, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    const apt = apartment.trim();
    if (!apt || apt.length > 10) {
      setStatus("error");
      setMessage("Укажите номер квартиры (до 10 символов).");
      return;
    }

    const readings: Partial<Record<MeterId, string>> = {};
    for (const id of building.meters) {
      const parsed = parseReading(values[id] ?? "");
      if (!parsed.ok) {
        setStatus("error");
        setMessage(`Проверьте показания: «${METER_LABELS[id]}». Нужно неотрицательное число.`);
        return;
      }
      readings[id] = parsed.value;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/readings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: building.slug,
          apartment: apt,
          readings,
          submittedAt: new Date().toISOString(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error ?? "Не удалось отправить. Попробуйте позже.");
        return;
      }
      setStatus("success");
      setMessage("Показания приняты. Спасибо!");
      setValues({});
      setApartment("");
    } catch {
      setStatus("error");
      setMessage("Ошибка сети. Проверьте подключение и попробуйте снова.");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 rounded-2xl border border-emerald-900/10 bg-white p-6 shadow-sm sm:p-8"
    >
      <div>
        <label
          htmlFor="apartment"
          className="block text-sm font-medium text-emerald-950"
        >
          Квартира
        </label>
        <input
          id="apartment"
          name="apartment"
          inputMode="numeric"
          autoComplete="off"
          value={apartment}
          onChange={(e) => setApartment(e.target.value)}
          className="mt-2 w-full max-w-xs rounded-xl border border-emerald-900/15 bg-emerald-50/30 px-4 py-3 text-emerald-950 outline-none ring-emerald-600/30 focus:ring-2"
          placeholder="Например, 42"
        />
      </div>

      {building.meters.map((id) => (
        <div key={id}>
          <label
            htmlFor={id}
            className="block text-sm font-medium text-emerald-950"
          >
            {METER_LABELS[id]}
          </label>
          <input
            id={id}
            name={id}
            inputMode="decimal"
            autoComplete="off"
            value={values[id] ?? ""}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, [id]: e.target.value }))
            }
            className="mt-2 w-full max-w-sm rounded-xl border border-emerald-900/15 bg-emerald-50/30 px-4 py-3 text-emerald-950 outline-none ring-emerald-600/30 focus:ring-2"
            placeholder="Показания счётчика"
          />
        </div>
      ))}

      {message && (
        <p
          className={
            status === "success"
              ? "text-sm font-medium text-emerald-800"
              : "text-sm font-medium text-red-700"
          }
          role="status"
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center justify-center rounded-xl bg-emerald-800 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "Отправка…" : "Отправить показания"}
      </button>
    </form>
  );
}
