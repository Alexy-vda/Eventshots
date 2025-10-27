import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/dashboard")) return;

  const access = req.cookies.get("access_token")?.value;
  if (access) return NextResponse.next();

  const refreshToken = req.cookies.get("refresh_token")?.value;
  if (!refreshToken) {

    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)"],
};
