import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get("url");
    const download = searchParams.get("download"); // Pour forcer le téléchargement

    if (!imageUrl) {
      return NextResponse.json({ error: "URL manquante" }, { status: 400 });
    }

    if (!imageUrl.includes(".r2.dev")) {
      return NextResponse.json({ error: "URL non autorisée" }, { status: 403 });
    }

    const response = await fetch(imageUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Erreur lors de la récupération de l'image" },
        { status: response.status }
      );
    }

    const blob = await response.blob();

    const fileName = imageUrl.split("/").pop() || "image.jpg";

    const headers: Record<string, string> = {
      "Content-Type": response.headers.get("Content-Type") || "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    };

    if (download === "true") {
      headers["Content-Disposition"] = `attachment; filename="${fileName}"`;
    }

    if (response.headers.get("Content-Length")) {
      headers["Content-Length"] = response.headers.get("Content-Length")!;
    }

    return new NextResponse(blob, { headers });
  } catch (error) {
    console.error("Erreur proxy image:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
