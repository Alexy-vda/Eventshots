import { createUploadthing, type FileRouter } from "uploadthing/next";
import { verifyToken } from "@/lib/auth";

const f = createUploadthing();

// FileRouter pour l'application
export const ourFileRouter = {
  // Route pour uploader des photos d'événements
  eventImageUploader: f({ image: { maxFileSize: "32MB", maxFileCount: 50 } })
    // Middleware pour vérifier l'authentification
    .middleware(async ({ req }) => {
      // Récupérer le token depuis les headers
      const token = req.headers.get("authorization")?.replace("Bearer ", "");

      if (!token) {
        throw new Error("Non authentifié");
      }

      const user = await verifyToken(token);

      if (!user) {
        throw new Error("Token invalide");
      }

      // Retourner les métadonnées qui seront disponibles dans onUploadComplete
      return { userId: user.userId };
    })
    // Callback appelé après un upload réussi
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);

      // Retourner les données au client
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
