import { NextResponse } from "next/server";
import {
  adminSessionCookieOptions,
  createAdminSessionValue,
  ADMIN_SESSION_COOKIE,
} from "@/lib/admin-auth";

const MAX_BODY = 4096;

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

  const res = NextResponse.json({ ok: true as const });
  res.cookies.set(
    ADMIN_SESSION_COOKIE,
    createAdminSessionValue(expected),
    adminSessionCookieOptions(),
  );
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true as const });
  res.cookies.set(ADMIN_SESSION_COOKIE, "", {
    ...adminSessionCookieOptions(),
    maxAge: 0,
  });
  return res;
}
