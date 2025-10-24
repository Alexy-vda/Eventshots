// app/api/login/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { signAccess, signRefresh } from "@/lib/auth";
import { prisma } from "@/lib/db";

// Schéma de validation
const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validation avec Zod
    const validatedData = loginSchema.parse(body);

    // Chercher l'utilisateur dans la DB
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(
      validatedData.password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Générer les tokens JWT
    const access = signAccess({ sub: user.id, email: user.email });
    const refresh = signRefresh({ sub: user.id, email: user.email });

    const cs = await cookies();
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

    return NextResponse.json({
      ok: true,
      token: access, // Envoyer aussi le token pour les client components
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    // Erreur de validation Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    // Autres erreurs
    console.error("[LOGIN] Error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la connexion" },
      { status: 500 }
    );
  }
}
