import { cookies } from "next/headers";

export async function POST() {
  const cs = await cookies();
  const isProduction = process.env.NODE_ENV === "production";

  cs.set("access_token", "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  cs.set("refresh_token", "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return Response.json({ ok: true });
}
