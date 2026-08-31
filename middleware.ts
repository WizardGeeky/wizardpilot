import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "fp_session";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/api/auth/github",
  "/api/auth/callback/github",
  "/api/auth/me",
  "/api/auth/logout",
  "/api/health",
];

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // Allow static files, Next.js internal chunks, and images
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/public") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // If GitHub returned an OAuth code to any path (e.g. / or /login), forward it to the callback handler
  const code = searchParams.get("code");
  if (code && pathname !== "/api/auth/callback/github") {
    const callbackUrl = new URL("/api/auth/callback/github", req.url);
    searchParams.forEach((value, key) => {
      callbackUrl.searchParams.set(key, value);
    });
    return NextResponse.redirect(callbackUrl);
  }

  const isPublicPath =
    pathname === "/" ||
    PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith("/api/auth/"));
  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;

  // If user is trying to visit /login while already authenticated, redirect to /dashboard
  if (pathname === "/login" && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // If unauthenticated and trying to access protected route (/dashboard, /projects, etc.), redirect to /login
  if (!isPublicPath && !sessionCookie) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
