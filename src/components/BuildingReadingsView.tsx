import Link from "next/link";
import { InnerPageSurface } from "@/components/InnerPageSurface";
import { MeterReadingsForm } from "@/components/MeterReadingsForm";
import { ReadingsClosedNotice } from "@/components/ReadingsClosedNotice";
import type { Building } from "@/data/buildings";
import { METER_LABELS } from "@/data/meters";
import { resolveReadingsWindow } from "@/lib/readings-window";
import { getReadingsWindowMode } from "@/lib/readings-window-storage";

export async function BuildingReadingsView({
  building,
}: {
  building: Building;
}) {
  const override = await getReadingsWindowMode();
  const windowOpen = resolveReadingsWindow(override) === "open";
  const metersList = building.meters.map((id) => METER_LABELS[id]).join(", ");

  return (
    <main className="mx-auto max-w-3xl px-3 py-8 sm:px-6 sm:py-14">
      <InnerPageSurface>
        <Link
          href="/"
          className="text-sm font-medium text-emerald-800 hover:text-emerald-950"
        >
          ← На главную
        </Link>
        <h1 className="mt-5 text-2xl font-bold leading-tight tracking-tight text-emerald-950 sm:mt-6 sm:text-3xl">
          Показания: {building.title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-emerald-900/85 sm:text-base">
          {building.addressLine}
        </p>

        {windowOpen ? (
          <>
            <p className="mt-4 text-sm text-emerald-800/90">
              Счётчики на этой странице:{" "}
              <span className="font-medium">{metersList}</span>.
            </p>
            <div className="mt-10">
              <MeterReadingsForm building={building} />
            </div>
          </>
        ) : (
          <div className="mt-10">
            <ReadingsClosedNotice />
          </div>
        )}
      </InnerPageSurface>
    </main>
  );
}
