import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getBuildingBySlug } from "@/data/buildings";
import {
  parseReadingsOverrideCookie,
  readingsOverrideCookieName,
  resolveReadingsWindow,
} from "@/lib/readings-window";
import { isMeterId, METER_LABELS } from "@/data/meters";
import { appendReading, readAllReadings } from "@/lib/readings-storage";
import {
  appendSuspiciousRecord,
  detectSuspiciousForReading,
} from "@/lib/suspicious-readings";

const MAX_BODY = 24_000;

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const override = parseReadingsOverrideCookie(
    cookieStore.get(readingsOverrideCookieName())?.value,
  );
  if (resolveReadingsWindow(override) === "closed") {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Сейчас не период приёма показаний (20–24 число каждого месяца, московское время).",
      },
      { status: 403 },
    );
  }

  let raw: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY) {
      return NextResponse.json(
        { ok: false, error: "Слишком большой запрос." },
        { status: 413 },
      );
    }
    raw = JSON.parse(text) as unknown;
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректный JSON." }, {
      status: 400,
    });
  }

  if (!raw || typeof raw !== "object") {
    return NextResponse.json({ ok: false, error: "Некорректные данные." }, {
      status: 400,
    });
  }

  const body = raw as Record<string, unknown>;
  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  const apartment =
    typeof body.apartment === "string" ? body.apartment.trim() : "";
  const submittedAt =
    typeof body.submittedAt === "string" ? body.submittedAt.trim() : "";

  if (!slug || !getBuildingBySlug(slug)) {
    return NextResponse.json({ ok: false, error: "Неизвестный дом." }, {
      status: 400,
    });
  }
  if (!apartment || apartment.length > 10) {
    return NextResponse.json(
      { ok: false, error: "Укажите корректный номер квартиры." },
      { status: 400 },
    );
  }
  if (!submittedAt || submittedAt.length > 40) {
    return NextResponse.json({ ok: false, error: "Некорректная дата." }, {
      status: 400,
    });
  }

  const building = getBuildingBySlug(slug)!;
  const readingsIn = body.readings;
  if (!readingsIn || typeof readingsIn !== "object") {
    return NextResponse.json({ ok: false, error: "Нет показаний." }, {
      status: 400,
    });
  }

  const readings: Record<string, string> = {};
  for (const meterId of building.meters) {
    const v = (readingsIn as Record<string, unknown>)[meterId];
    if (typeof v !== "string" || v.trim() === "") {
      return NextResponse.json(
        { ok: false, error: `Не заполнено: ${METER_LABELS[meterId]}` },
        { status: 400 },
      );
    }
    const t = v.trim().replace(",", ".");
    const n = Number(t);
    if (!Number.isFinite(n) || n < 0 || n > 1_000_000_000) {
      return NextResponse.json(
        { ok: false, error: "Некорректные показания." },
        { status: 400 },
      );
    }
    readings[meterId] = t;
  }

  for (const k of Object.keys(readingsIn as object)) {
    if (!isMeterId(k)) {
      return NextResponse.json({ ok: false, error: "Лишние поля." }, {
        status: 400,
      });
    }
    if (!building.meters.includes(k)) {
      return NextResponse.json({ ok: false, error: "Лишние счётчики." }, {
        status: 400,
      });
    }
  }

  try {
    const saved = await appendReading({
      slug,
      buildingTitle: building.title,
      apartment,
      readings,
      submittedAt,
    });

    const all = await readAllReadings();
    const suspicious = detectSuspiciousForReading(
      saved,
      all,
      building.meters,
    );
    if (suspicious) {
      await appendSuspiciousRecord(suspicious);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Не удалось сохранить показания." },
      { status: 500 },
    );
  }
}
