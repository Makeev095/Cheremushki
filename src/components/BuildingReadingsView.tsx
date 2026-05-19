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
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <InnerPageSurface>
        <Link
          href="/#pokazaniya"
          className="text-sm font-medium text-emerald-800 hover:text-emerald-950"
        >
          ← Все дома
        </Link>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-emerald-950">
          Показания: {building.title}
        </h1>
        <p className="mt-2 text-emerald-900/85">{building.addressLine}</p>

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
