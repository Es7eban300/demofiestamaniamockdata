import { NextRequest, NextResponse } from "next/server";

const USER_COOKIE = "fm-user-session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(USER_COOKIE)?.value;

  // Protect customer account routes
  if (pathname.startsWith("/cuenta")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect already-authenticated users away from login/registro
  if ((pathname === "/login" || pathname === "/registro") && token) {
    return NextResponse.redirect(new URL("/cuenta", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cuenta/:path*", "/login", "/registro"],
};
