import { NextResponse } from "next/server";
import type { ReadingsWindowOverride } from "@/lib/readings-window";
import {
  getReadingsWindowMode,
  setReadingsWindowMode,
} from "@/lib/readings-window-storage";

const MAX_BODY = 4096;

function isMode(v: unknown): v is ReadingsWindowOverride {
  return v === "auto" || v === "open" || v === "closed";
}

export async function POST(request: Request) {
  const expected = process.env.READINGS_ADMIN_SECRET;
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "READINGS_ADMIN_SECRET не настроен." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY) {
      return NextResponse.json({ ok: false, error: "Слишком большой запрос." }, {
        status: 413,
      });
    }
    body = JSON.parse(text) as unknown;
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректный JSON." }, {
      status: 400,
    });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Некорректные данные." }, {
      status: 400,
    });
  }

  const o = body as Record<string, unknown>;
  if (typeof o.secret !== "string" || o.secret !== expected) {
    return NextResponse.json({ ok: false, error: "Неверный пароль." }, {
      status: 401,
    });
  }
  if (!isMode(o.mode)) {
    return NextResponse.json({ ok: false, error: "Некорректный режим." }, {
      status: 400,
    });
  }

  const stored = await setReadingsWindowMode(o.mode);
  return NextResponse.json({
    ok: true as const,
    mode: stored.mode,
    updatedAt: stored.updatedAt,
  });
}

/** Текущий режим для всех посетителей (без секрета). */
export async function GET() {
  const mode = await getReadingsWindowMode();
  return NextResponse.json({ mode });
}
