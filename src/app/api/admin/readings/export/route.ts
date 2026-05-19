import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getBuildingBySlug } from "@/data/buildings";
import { parsePeriodParam } from "@/lib/readings-period";
import { buildWorkbookAll, buildWorkbookForSlug } from "@/lib/readings-export";

export async function GET(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ ok: false, error: "Требуется вход." }, {
      status: 401,
    });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug")?.trim() ?? "";
  const periodRaw = searchParams.get("period");
  const period =
    periodRaw === null || periodRaw === "" || periodRaw === "all"
      ? null
      : parsePeriodParam(periodRaw);

  if (periodRaw && periodRaw !== "all" && period === null) {
    return NextResponse.json(
      { ok: false, error: "Некорректный период (ожидается ГГГГ-ММ)." },
      { status: 400 },
    );
  }

  try {
    if (slug) {
      if (!getBuildingBySlug(slug)) {
        return NextResponse.json({ ok: false, error: "Неизвестный дом." }, {
          status: 400,
        });
      }
      const { buffer, filename } = await buildWorkbookForSlug(slug, period);
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
        },
      });
    }

    const { buffer, filename } = await buildWorkbookAll(period);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
      },
    });
  } catch (e) {
    if (e instanceof Error && e.message === "UNKNOWN_BUILDING") {
      return NextResponse.json({ ok: false, error: "Неизвестный дом." }, {
        status: 400,
      });
    }
    return NextResponse.json(
      { ok: false, error: "Не удалось сформировать файл." },
      { status: 500 },
    );
  }
}
