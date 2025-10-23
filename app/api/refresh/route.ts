import { cookies } from "next/headers";
import { signAccess, signRefresh, verifyRefresh } from "@/lib/auth";

export async function POST() {
  const cs = await cookies();
  const rt = cs.get("refresh_token")?.value;
  if (!rt) return new Response("No refresh", { status: 401 });

  try {
    const payload = verifyRefresh(rt);
    const access = signAccess({ sub: payload.sub, email: payload.email });
    const refresh = signRefresh({ sub: payload.sub, email: payload.email });

    const isProduction = process.env.NODE_ENV === "production";

    cs.set("access_token", access, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
    });
    cs.set("refresh_token", refresh, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
    });
    return Response.json({ ok: true });
  } catch {
    return new Response("Invalid refresh", { status: 401 });
  }
}
