// Utilitaires pour les API routes
import { NextResponse } from "next/server";
import { ZodError } from "zod";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

/**
 * Wrapper pour les handlers d'API avec gestion d'erreurs centralisée
 */
export function apiHandler<T = JsonValue>(
  handler: (req: Request) => Promise<NextResponse<T>>
) {
  return async (req: Request): Promise<NextResponse> => {
    try {
      return await handler(req);
    } catch (error) {
      console.error("[API Error]", error);

      // Erreurs de validation Zod
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            error: "Validation échouée",
            details: error.issues.map((e) => ({
              path: e.path.join("."),
              message: e.message,
            })),
          },
          { status: 400 }
        );
      }

      // Erreurs métier personnalisées
      if (error instanceof ApiError) {
        return NextResponse.json(
          { error: error.message, details: error.details },
          { status: error.statusCode }
        );
      }

      // Erreur générique
      return NextResponse.json(
        { error: "Une erreur interne est survenue" },
        { status: 500 }
      );
    }
  };
}

/**
 * Classe d'erreur personnalisée pour les APIs
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public details?: JsonValue
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Extraire et vérifier le token d'authentification
 */
export function extractAuthToken(req: Request): string {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new ApiError("Non authentifié", 401);
  }
  return authHeader.replace("Bearer ", "");
}

/**
 * Helper pour créer des réponses JSON typées
 */
export function jsonResponse<T>(data: T, status = 200): NextResponse<T> {
  return NextResponse.json(data, { status });
}

/**
 * Helper pour créer des réponses d'erreur
 */
export function errorResponse(
  message: string,
  status = 400,
  details?: JsonValue
): NextResponse {
  return NextResponse.json({ error: message, details }, { status });
}
