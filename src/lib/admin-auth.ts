import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth-constants";

export { ADMIN_SESSION_COOKIE };

function sessionToken(secret: string): string {
  return createHmac("sha256", secret).update("readings-admin-v1").digest("hex");
}

export function verifyAdminSession(
  cookieValue: string | undefined,
  secret: string | undefined,
): boolean {
  if (!secret || !cookieValue) return false;
  const expected = sessionToken(secret);
  try {
    const a = Buffer.from(cookieValue, "utf8");
    const b = Buffer.from(expected, "utf8");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function isAdminRequest(): Promise<boolean> {
  const secret = process.env.READINGS_ADMIN_SECRET;
  const cookieStore = await cookies();
  const raw = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return verifyAdminSession(raw, secret);
}

export function adminSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
  };
}

export function createAdminSessionValue(secret: string): string {
  return sessionToken(secret);
}
