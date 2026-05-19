import { notFound, permanentRedirect } from "next/navigation";
import { getBuildingBySlug } from "@/data/buildings";
import { slugToLegacyPath } from "@/lib/legacy-paths";

type Props = { params: Promise<{ slug: string }> };

/** Старый путь /dom/... → постоянный редирект на /bulgakova_5 и т.д. */
export default async function DomSlugRedirect({ params }: Props) {
  const { slug } = await params;
  const building = getBuildingBySlug(slug);
  if (!building) notFound();
  permanentRedirect(`/${slugToLegacyPath(slug)}`);
}
