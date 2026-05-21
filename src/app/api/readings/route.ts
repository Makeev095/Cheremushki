import { NextResponse } from "next/server";
import { getBuildingBySlug } from "@/data/buildings";
import { resolveReadingsWindow } from "@/lib/readings-window";
import { getReadingsWindowMode } from "@/lib/readings-window-storage";
import { isMeterId, METER_LABELS, type MeterId } from "@/data/meters";
import { isWaterMeter, parseMeterReading } from "@/lib/meter-reading-parse";
import {
  appendReading,
  findMonthlyDuplicate,
  readAllReadings,
} from "@/lib/readings-storage";
import {
  appendSuspiciousRecord,
  detectSuspiciousForReading,
} from "@/lib/suspicious-readings";

const MAX_BODY = 24_000;

export async function POST(request: Request) {
  const override = await getReadingsWindowMode();
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
    const parsed = parseMeterReading(v, meterId as MeterId);
    if (!parsed.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: isWaterMeter(meterId as MeterId)
            ? `Некорректные показания: ${METER_LABELS[meterId as MeterId]}.`
            : "Некорректные показания.",
        },
        { status: 400 },
      );
    }
    readings[meterId] = parsed.value;
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
    const all = await readAllReadings();
    const duplicate = findMonthlyDuplicate(
      all,
      { slug, apartment, readings, submittedAt },
      building.meters,
    );
    if (duplicate) {
      return NextResponse.json({ ok: true, duplicate: true });
    }

    const saved = await appendReading({
      slug,
      buildingTitle: building.title,
      apartment,
      readings,
      submittedAt,
    });

    const suspicious = detectSuspiciousForReading(
      saved,
      all,
      building.meters,
    );
    if (suspicious) {
      await appendSuspiciousRecord(suspicious);
    }

    return NextResponse.json({ ok: true, duplicate: false });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Не удалось сохранить показания." },
      { status: 500 },
    );
  }
}
