import { NextRequest, NextResponse } from "next/server";
import { StorageUtility, StorageKeys } from "./lib/local-storage";

const PROTECTED_PREFIXES = ["/home"];
const AUTH_PREFIXES = ["/login"];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = StorageUtility.getItem(StorageKeys.SESSION_TOKEN)

  if (pathname === "/login" && request.nextUrl.searchParams.has("expired")) {
    const response = NextResponse.next();
    StorageUtility.removeItem(StorageKeys.SESSION_TOKEN)
    return response;
  }

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );
  const isAuthRoute = AUTH_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && token) {
    const homeUrl = new URL("/home", request.url);
    return NextResponse.redirect(homeUrl);
  }

  if (pathname === "/") {
    if (token) {
      return NextResponse.redirect(new URL("/home", request.url));
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|icons|.*\\.svg$).*)",
  ],
};
