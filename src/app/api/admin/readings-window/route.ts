import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  parseReadingsOverrideCookie,
  readingsOverrideCookieName,
  type ReadingsWindowOverride,
} from "@/lib/readings-window";

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

  const mode = o.mode;
  const res = NextResponse.json({ ok: true as const, mode });
  res.cookies.set(readingsOverrideCookieName(), mode, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 90,
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}

/** Диагностика: текущее переопределение (без секрета). */
export async function GET() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(readingsOverrideCookieName())?.value;
  const mode = parseReadingsOverrideCookie(raw);
  return NextResponse.json({ mode });
}
