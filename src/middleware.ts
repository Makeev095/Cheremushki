import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth-constants";
import { isValidAdminSessionCookie } from "@/lib/admin-session-edge";

function isPublicAdminPath(pathname: string): boolean {
  return pathname === "/admin/login";
}

function isProtectedAdminPath(pathname: string): boolean {
  if (!pathname.startsWith("/admin")) return false;
  return !isPublicAdminPath(pathname);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedAdminPath(pathname)) {
    return NextResponse.next();
  }

  const secret = process.env.READINGS_ADMIN_SECRET;
  const cookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const ok = await isValidAdminSessionCookie(cookie, secret);

  if (ok) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/admin/login", request.url);
  const nextPath = `${pathname}${request.nextUrl.search}`;
  loginUrl.searchParams.set("next", nextPath);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
