// lib/auth.ts
import jwt, { JwtPayload } from "jsonwebtoken";

// Vérifier que JWT_SECRET existe
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be defined in environment variables");
}

// Type assertion après vérification
const secret: string = JWT_SECRET;

// Types pour les payloads
export interface AccessTokenPayload {
  sub: string;
  email: string;
}

export interface RefreshTokenPayload {
  sub: string;
  email: string;
}

export function signAccess(payload: AccessTokenPayload): string {
  return jwt.sign(payload, secret, { expiresIn: "10m" });
}

export function signRefresh(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export function verify(token: string): JwtPayload {
  const decoded = jwt.verify(token, secret);

  // jwt.verify peut retourner string | JwtPayload
  if (typeof decoded === "string") {
    throw new Error("Invalid token format");
  }

  return decoded;
}

export function verifyAccess(token: string): AccessTokenPayload {
  const payload = verify(token);

  if (!payload.sub || !payload.email) {
    throw new Error("Invalid access token payload");
  }

  return {
    sub: payload.sub,
    email: payload.email as string,
  };
}

export function verifyRefresh(token: string): RefreshTokenPayload {
  const payload = verify(token);

  if (!payload.sub || !payload.email) {
    throw new Error("Invalid refresh token payload");
  }

  return {
    sub: payload.sub,
    email: payload.email as string,
  };
}

// Helper pour vérifier un token et retourner le userId
export async function verifyToken(
  token: string
): Promise<{ userId: string; email: string } | null> {
  try {
    const payload = verifyAccess(token);
    return {
      userId: payload.sub,
      email: payload.email,
    };
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
