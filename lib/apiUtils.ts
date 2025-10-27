
import { NextResponse } from "next/server";
import { ZodError } from "zod";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export function apiHandler<T = JsonValue>(
  handler: (req: Request) => Promise<NextResponse<T>>
) {
  return async (req: Request): Promise<NextResponse> => {
    try {
      return await handler(req);
    } catch (error) {
      console.error("[API Error]", error);

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

      if (error instanceof ApiError) {
        return NextResponse.json(
          { error: error.message, details: error.details },
          { status: error.statusCode }
        );
      }

      return NextResponse.json(
        { error: "Une erreur interne est survenue" },
        { status: 500 }
      );
    }
  };
}

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

export function extractAuthToken(req: Request): string {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new ApiError("Non authentifié", 401);
  }
  return authHeader.replace("Bearer ", "");
}

export function jsonResponse<T>(data: T, status = 200): NextResponse<T> {
  return NextResponse.json(data, { status });
}

export function errorResponse(
  message: string,
  status = 400,
  details?: JsonValue
): NextResponse {
  return NextResponse.json({ error: message, details }, { status });
}
