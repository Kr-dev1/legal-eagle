import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const pathname = request.nextUrl.pathname;
  if (
    pathname.includes("/signin") ||
    pathname.includes("/signup") ||
    pathname.includes("/auth/callback")
  ) {
    if (sessionCookie) {
      if (pathname.includes("/signin") || pathname.includes("/signup")) {
        return NextResponse.redirect(new URL("/auth/callback", request.url));
      }
    }
    return NextResponse.next();
  }
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/chat/:path*", "/signin", "/signup", "/upload", "/auth/callback"],
};
