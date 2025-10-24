import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

// DELETE /api/photos/[id] - Supprimer une photo
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Vérifier l'authentification
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }

    // Récupérer la photo
    const photo = await prisma.photo.findUnique({
      where: { id },
      include: {
        event: true,
      },
    });

    if (!photo) {
      return NextResponse.json({ error: "Photo non trouvée" }, { status: 404 });
    }

    // Vérifier que l'événement appartient à l'utilisateur
    if (photo.event.userId !== payload.userId) {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 403 }
      );
    }

    // Extraire la clé du fichier de l'URL UploadThing
    const fileKey = photo.url.split("/").pop();

    // Supprimer le fichier d'UploadThing
    if (fileKey) {
      try {
        await utapi.deleteFiles(fileKey);
      } catch (err) {
        console.error("Erreur lors de la suppression du fichier:", err);
        // Continuer même si la suppression UploadThing échoue
      }
    }

    // Supprimer la photo de la base de données
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

// GET /api/photos/[id] - Récupérer une photo spécifique
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
