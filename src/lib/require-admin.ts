import { redirect } from "next/navigation";
import { isAdminRequest } from "@/lib/admin-auth";

/** Не отдаёт страницу без входа — перенаправляет на /admin/login */
export async function requireAdmin(returnPath = "/admin/readings"): Promise<void> {
  if (!(await isAdminRequest())) {
    redirect(`/admin/login?next=${encodeURIComponent(returnPath)}`);
  }
}
