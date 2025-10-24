// lib/db.ts
import { PrismaClient } from "./generated/prisma/client";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Forcer le chemin absolu de la base de données en développement
const getDatabaseUrl = () => {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error("DATABASE_URL is not defined");
  }

  // Si c'est un chemin relatif SQLite, le convertir en chemin absolu
  if (dbUrl.startsWith("file:./")) {
    const absolutePath = path.resolve(
      process.cwd(),
      dbUrl.replace("file:./", "")
    );
    return `file:${absolutePath}`;
  }

  return dbUrl;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
