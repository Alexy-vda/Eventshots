import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL; // ex: https://pub-xxxxx.r2.dev

if (
  !R2_ACCOUNT_ID ||
  !R2_ACCESS_KEY_ID ||
  !R2_SECRET_ACCESS_KEY ||
  !R2_BUCKET_NAME ||
  !R2_PUBLIC_URL
) {
  throw new Error(
    "Missing R2 environment variables. Please check your .env file."
  );
}

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

export async function uploadToR2(
  file: File,
  folder: string = "uploads"
): Promise<string> {

  const fileExtension = file.name.split(".").pop();
  const fileName = `${folder}/${nanoid()}.${fileExtension}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: fileName,
    Body: buffer,
    ContentType: file.type,
  });

  await r2Client.send(command);

  return `${R2_PUBLIC_URL}/${fileName}`;
}

export async function deleteFromR2(fileUrl: string): Promise<void> {

  if (!R2_PUBLIC_URL || !fileUrl.startsWith(R2_PUBLIC_URL)) {
    throw new Error("URL invalide: le fichier n'appartient pas à ce bucket R2");
  }

  const fileName = fileUrl.replace(`${R2_PUBLIC_URL}/`, "");

  if (fileName.includes("..") || fileName.startsWith("/")) {
    throw new Error(
      "Nom de fichier invalide: tentative de path traversal détectée"
    );
  }

  const allowedPrefixes = ["events/", "uploads/"];
  const hasValidPrefix = allowedPrefixes.some((prefix) =>
    fileName.startsWith(prefix)
  );

  if (!hasValidPrefix) {
    throw new Error(
      `Chemin non autorisé: le fichier doit être dans ${allowedPrefixes.join(
        " ou "
      )}`
    );
  }

  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: fileName,
  });

  await r2Client.send(command);
}

export async function deleteMultipleFromR2(fileUrls: string[]): Promise<void> {
  await Promise.all(fileUrls.map((url) => deleteFromR2(url)));
}
