import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "iskcon-vartak-nagar-access-super-secret-key-2026-secure";
const accessSecretKey = new TextEncoder().encode(JWT_ACCESS_SECRET);

const PUBLIC_ADMIN_PATHS = [
  "/admin/login",
  "/admin/forgot-password",
  "/admin/reset-password",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply to /admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const isPublicAdminRoute = PUBLIC_ADMIN_PATHS.some((path) =>
    pathname === path || pathname.startsWith(`${path}/`)
  );

  const accessToken = request.cookies.get("admin_access_token")?.value;
  const refreshToken = request.cookies.get("admin_refresh_token")?.value;

  let isValidAccessToken = false;
  if (accessToken) {
    try {
      await jwtVerify(accessToken, accessSecretKey);
      isValidAccessToken = true;
    } catch {
      isValidAccessToken = false;
    }
  }

  // If visiting login/forgot/reset page while already authenticated with a valid access token
  if (isPublicAdminRoute) {
    if (isValidAccessToken) {
      const dashboardUrl = new URL("/admin", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
    return NextResponse.next();
  }

  // If visiting protected admin page without valid access or refresh token
  if (!isValidAccessToken && !refreshToken) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
