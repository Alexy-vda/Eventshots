import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be defined in environment variables");
}

const secret: string = JWT_SECRET;

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
