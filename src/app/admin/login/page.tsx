import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { InnerPageSurface } from "@/components/InnerPageSurface";
import { isAdminRequest } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Вход",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ next?: string }> };

function safeNextPath(raw: string | undefined): string {
  if (!raw || !raw.startsWith("/admin")) return "/admin/readings";
  if (raw.startsWith("/admin/login")) return "/admin/readings";
  return raw;
}

export default async function AdminLoginPage({ searchParams }: Props) {
  const sp = await searchParams;
  const next = safeNextPath(sp.next);
  const secretConfigured = Boolean(process.env.READINGS_ADMIN_SECRET?.length);

  if (await isAdminRequest()) {
    redirect(next);
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10 sm:px-6 sm:py-14">
      <InnerPageSurface>
        <Link
          href="/"
          className="text-sm font-medium text-emerald-800 hover:text-emerald-950"
        >
          ← На главную
        </Link>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-emerald-950">
          Вход
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-emerald-900/85">
          
        </p>
        <div className="mt-8">
          <AdminLoginForm
            secretConfigured={secretConfigured}
            redirectTo={next}
            loginOnly
          />
        </div>
      </InnerPageSurface>
    </main>
  );
}
