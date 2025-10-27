import sharp from "sharp";
import { r2Client } from "./r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";
import { prisma } from "./db";

const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

export async function optimizePhoto(photoId: string) {
  try {
    console.log(`[Optimizer] Début optimisation photo ${photoId}`);

    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
    });

    if (!photo) {
      console.error(`[Optimizer] Photo ${photoId} introuvable`);
      return { success: false, error: "Photo not found" };
    }

    if (photo.displayUrl) {
      console.log(`[Optimizer] Photo ${photoId} déjà optimisée`);
      return { success: true, skipped: true };
    }

    console.log(`[Optimizer] Fetch original depuis R2: ${photo.url}`);

    const response = await fetch(photo.url);
    if (!response.ok) {
      throw new Error(`Failed to fetch original: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log(
      `[Optimizer] Original téléchargé: ${(buffer.length / 1024 / 1024).toFixed(
        2
      )}MB`
    );

    const optimizedBuffer = await sharp(buffer)
      .resize(1920, null, {
        fit: "inside", // Garde aspect ratio
        withoutEnlargement: true, // Ne pas agrandir si plus petit
      })
      .webp({ quality: 80 }) // WebP quality 80 = bon compromis
      .toBuffer();

    const optimizedSizeMB = optimizedBuffer.length / 1024 / 1024;
    console.log(
      `[Optimizer] Image optimisée: ${optimizedSizeMB.toFixed(2)}MB (ratio: ${(
        (optimizedSizeMB / (buffer.length / 1024 / 1024)) *
        100
      ).toFixed(1)}%)`
    );

    const eventId = photo.eventId;
    const key = `events/${eventId}/${nanoid()}.webp`;

    console.log(`[Optimizer] Upload vers R2: ${key}`);

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: optimizedBuffer,
      ContentType: "image/webp",
    });

    await r2Client.send(command);

    const optimizedUrl = `${R2_PUBLIC_URL}/${key}`;

    console.log(`[Optimizer] Optimisée uploadée: ${optimizedUrl}`);

    await prisma.photo.update({
      where: { id: photoId },
      data: { displayUrl: optimizedUrl },
    });

    console.log(`[Optimizer] Photo ${photoId} optimisée avec succès ✅`);

    return {
      success: true,
      originalSize: buffer.length,
      optimizedSize: optimizedBuffer.length,
      ratio: (optimizedBuffer.length / buffer.length) * 100,
      displayUrl: optimizedUrl,
    };
  } catch (error) {
    console.error(`[Optimizer] Erreur optimisation photo ${photoId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function optimizePhotos(
  photoIds: string[],
  concurrency: number = 3
) {
  console.log(
    `[Optimizer] Début optimisation batch: ${photoIds.length} photos (concurrency: ${concurrency})`
  );

  const results = [];

  for (let i = 0; i < photoIds.length; i += concurrency) {
    const batch = photoIds.slice(i, i + concurrency);
    console.log(
      `[Optimizer] Batch ${Math.floor(i / concurrency) + 1}/${Math.ceil(
        photoIds.length / concurrency
      )}: ${batch.length} photos`
    );

    const batchResults = await Promise.all(
      batch.map((id) => optimizePhoto(id))
    );
    results.push(...batchResults);
  }

  const successful = results.filter((r) => r.success).length;
  console.log(
    `[Optimizer] Batch terminé: ${successful}/${photoIds.length} réussies`
  );

  return results;
}
