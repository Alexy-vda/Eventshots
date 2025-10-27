import { NextRequest, NextResponse } from "next/server";
import { optimizePhoto } from "@/lib/imageOptimizer";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log(`[API] Requête optimisation photo ${id}`);

    const result = await optimizePhoto(id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API] Erreur optimisation:", error);
    return NextResponse.json(
      { error: "Failed to optimize photo" },
      { status: 500 }
    );
  }
}
