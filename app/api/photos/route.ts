import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

const uploadPhotoSchema = z.object({
  eventId: z.string(),
  url: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  fileName: z.string(),
  fileSize: z.number().int().positive(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});

export async function POST(req: Request) {
  try {
    console.log("[PHOTOS POST] Début de la requête");

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }

    console.log("[PHOTOS POST] User authentifié:", payload.userId);

    const body = await req.json();
    const validatedData = uploadPhotoSchema.parse(body);

    const event = await prisma.event.findUnique({
      where: { id: validatedData.eventId },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Événement non trouvé" },
        { status: 404 }
      );
    }

    if (event.userId !== payload.userId) {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 403 }
      );
    }

    const photo = await prisma.photo.create({
      data: {
        eventId: validatedData.eventId,
        url: validatedData.url,
        thumbnailUrl: validatedData.thumbnailUrl,
        fileName: validatedData.fileName,
        fileSize: validatedData.fileSize,
        width: validatedData.width,
        height: validatedData.height,
      },
    });

    console.log("[PHOTOS POST] Photo créée avec succès:", photo.id);

    return NextResponse.json(
      {
        message: "Photo uploadée avec succès",
        photo,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[PHOTOS POST] Error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de l'upload de la photo" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json(
        { error: "eventId est requis" },
        { status: 400 }
      );
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Événement non trouvé" },
        { status: 404 }
      );
    }

    const photos = await prisma.photo.findMany({
      where: { eventId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ photos });
  } catch (error) {
    console.error("[PHOTOS GET] Error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des photos" },
      { status: 500 }
    );
  }
}
