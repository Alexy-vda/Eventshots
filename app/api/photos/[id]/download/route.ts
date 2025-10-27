import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.photo.update({
      where: { id },
      data: {
        downloadCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Download count incremented",
    });
  } catch (err) {
    console.error("[DOWNLOAD_PHOTO_ERROR]", err);
    return NextResponse.json(
      { error: "Failed to track download" },
      { status: 500 }
    );
  }
}
