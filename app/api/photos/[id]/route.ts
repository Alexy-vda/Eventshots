import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { deleteFromR2 } from "@/lib/r2";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }

    const photo = await prisma.photo.findUnique({
      where: { id },
      include: {
        event: true,
      },
    });

    if (!photo) {
      return NextResponse.json({ error: "Photo non trouvée" }, { status: 404 });
    }

    if (photo.event.userId !== payload.userId) {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 403 }
      );
    }

    try {
      await deleteFromR2(photo.url);
    } catch (err) {
      console.error("Erreur lors de la suppression du fichier R2:", err);

    }

    await prisma.photo.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Photo supprimée avec succès",
    });
  } catch (error) {
    console.error("[PHOTO DELETE] Error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la photo" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const photo = await prisma.photo.findUnique({
      where: { id },
      include: {
        event: true,
      },
    });

    if (!photo) {
      return NextResponse.json({ error: "Photo non trouvée" }, { status: 404 });
    }

    return NextResponse.json({ photo });
  } catch (error) {
    console.error("[PHOTO GET] Error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la photo" },
      { status: 500 }
    );
  }
}
