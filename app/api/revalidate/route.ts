
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  const authHeader = req.headers.get("authorization");
  const providedSecret = authHeader?.replace("Bearer ", "");

  if (!providedSecret || providedSecret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { error: "Non autorisé - secret invalide" },
      { status: 401 }
    );
  }

  const { tag } = await req.json().catch(() => ({ tag: "events" }));

  const validTags = ["events", "layout", "photos"];
  if (!validTags.includes(tag)) {
    return NextResponse.json(
      { error: "Tag invalide", validTags },
      { status: 400 }
    );
  }

  revalidateTag(tag, "layout");

  return NextResponse.json({
    revalidated: true,
    tag,
    timestamp: new Date().toISOString(),
  });
}
