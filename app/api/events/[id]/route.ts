import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// GET /api/events/[id] - Récupérer un événement spécifique
export async function GET(
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

    // Récupérer l'événement
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Événement non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier que l'événement appartient à l'utilisateur
    if (event.userId !== payload.userId) {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 403 }
      );
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error("[EVENT GET] Error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'événement" },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id] - Supprimer un événement
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

    // Vérifier que l'événement existe et appartient à l'utilisateur
    const event = await prisma.event.findUnique({
      where: { id },
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

    // Supprimer l'événement
    await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Événement supprimé avec succès",
    });
  } catch (error) {
    console.error("[EVENT DELETE] Error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'événement" },
      { status: 500 }
    );
  }
}

// PATCH /api/events/[id] - Modifier un événement
export async function PATCH(
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

    // Vérifier que l'événement existe et appartient à l'utilisateur
    const event = await prisma.event.findUnique({
      where: { id },
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

    // Mettre à jour l'événement
    const body = await req.json();
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        date: body.date ? new Date(body.date) : undefined,
        location: body.location,
      },
    });

    return NextResponse.json({
      message: "Événement modifié avec succès",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("[EVENT PATCH] Error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la modification de l'événement" },
      { status: 500 }
    );
  }
}
