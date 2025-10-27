import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { nanoid } from "nanoid";
import {
  apiHandler,
  ApiError,
  extractAuthToken,
  jsonResponse,
} from "@/lib/apiUtils";
import { checkRateLimit } from "@/lib/rateLimit";

const createEventSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z.string().optional(),
  date: z.string().datetime("Date invalide"),
  location: z.string().optional(),
});

function generateSlug(title: string): string {
  const baseSlug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Retirer les accents
    .replace(/[^a-z0-9]+/g, "-") // Remplacer les caractères non alphanumériques par des tirets
    .replace(/^-+|-+$/g, ""); // Retirer les tirets au début et à la fin

  return `${baseSlug}-${nanoid(6)}`;
}

function generateShareLink(): string {
  return nanoid(12);
}

export const GET = apiHandler(async (req: Request) => {

  const token = extractAuthToken(req);
  const payload = await verifyToken(token);

  if (!payload) {
    throw new ApiError("Token invalide", 401);
  }

  const rateLimit = checkRateLimit(`user:${payload.userId}:events:list`, 100);
  if (rateLimit.limited) {
    throw new ApiError("Trop de requêtes, veuillez réessayer plus tard", 429);
  }

  const events = await prisma.event.findMany({
    where: { userId: payload.userId },
    orderBy: { date: "desc" },
    include: {
      _count: {
        select: { photos: true },
      },
      photos: {
        take: 1,
        orderBy: { createdAt: "asc" },
        select: {
          url: true,
        },
      },
    },
  });

  return jsonResponse({ events });
});

export const POST = apiHandler(async (req: Request) => {

  const token = extractAuthToken(req);
  const payload = await verifyToken(token);

  if (!payload) {
    throw new ApiError("Token invalide", 401);
  }

  const rateLimit = checkRateLimit(
    `user:${payload.userId}:events:create`,
    20,
    60000
  );
  if (rateLimit.limited) {
    throw new ApiError("Trop de requêtes, veuillez réessayer plus tard", 429);
  }

  const body = await req.json();
  const validatedData = createEventSchema.parse(body);

  const slug = generateSlug(validatedData.title);
  const shareLink = generateShareLink();

  const event = await prisma.event.create({
    data: {
      title: validatedData.title,
      description: validatedData.description,
      date: new Date(validatedData.date),
      location: validatedData.location,
      slug,
      shareLink,
      userId: payload.userId,
    },
  });

  return jsonResponse(
    {
      message: "Événement créé avec succès",
      event,
    },
    201
  );
});
