import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { uploadToR2 } from "@/lib/r2";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {

    const token = request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const blurDataUrls = formData.getAll("blurDataUrls") as string[];
    const eventId = formData.get("eventId") as string;

    if (!eventId) {
      return NextResponse.json({ error: "Event ID requis" }, { status: 400 });
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "Aucun fichier fourni" },
        { status: 400 }
      );
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { userId: true },
    });

    if (!event || event.userId !== user.userId) {
      return NextResponse.json(
        { error: "Événement non trouvé ou non autorisé" },
        { status: 403 }
      );
    }

    const uploadedPhotos = await Promise.all(
      files.map(async (file, index) => {

        const url = await uploadToR2(file, `events/${eventId}`);

        const photo = await prisma.photo.create({
          data: {
            url,
            eventId,
            fileName: file.name,
            fileSize: file.size,
            blurDataUrl: blurDataUrls[index] || null, // Stocker le blur placeholder
          },
        });

        fetch(`${request.nextUrl.origin}/api/photos/${photo.id}/optimize`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }).catch((err) => {

          console.error(
            `[Upload] Erreur lancement optimisation photo ${photo.id}:`,
            err
          );
        });

        return {
          id: photo.id,
          url: photo.url,
          createdAt: photo.createdAt.toISOString(),
        };
      })
    );

    return NextResponse.json({
      success: true,
      photos: uploadedPhotos,
    });
  } catch (error) {
    console.error("Erreur lors de l'upload:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Erreur lors de l'upload",
      },
      { status: 500 }
    );
  }
}
