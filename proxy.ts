import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/dashboard")) return;

  const access = req.cookies.get("access_token")?.value;
  if (access) return NextResponse.next();

  // Pas d'access → vérifier si refresh existe avant de rediriger
  const refreshToken = req.cookies.get("refresh_token")?.value;
  if (!refreshToken) {
    // Pas de refresh token, redirection login
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Un refresh token existe, on laisse passer
  // La page appellera /api/refresh si nécessaire côté client
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)"],
};
