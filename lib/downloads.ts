import JSZip from "jszip";
import type { Photo } from "@/types";

export async function downloadSinglePhoto(photo: Photo) {
  try {

    const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(
      photo.url
    )}&download=true`;

    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error("Erreur lors du téléchargement");

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = photo.fileName;

    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);

    return true;
  } catch (error) {
    console.error("Erreur téléchargement:", error);
    return false;
  }
}

export async function downloadPhotosAsZip(
  photos: Photo[],
  eventName: string,
  onProgress?: (current: number, total: number) => void
) {
  try {
    const zip = new JSZip();
    const folder = zip.folder(eventName || "photos");

    if (!folder) throw new Error("Impossible de créer le dossier ZIP");

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];

      if (onProgress) {
        onProgress(i + 1, photos.length);
      }

      try {

        let response = await fetch(photo.url, {
          mode: "cors",
          credentials: "omit",
        });

        if (!response.ok) {
          const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(
            photo.url
          )}`;
          response = await fetch(proxyUrl);
        }

        if (!response.ok) {
          console.warn(`Échec du téléchargement de ${photo.fileName}`);
          continue;
        }

        const blob = await response.blob();
        folder.file(photo.fileName, blob);
      } catch (error) {
        console.warn(`Erreur avec ${photo.fileName}:`, error);

        try {
          const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(
            photo.url
          )}`;
          const proxyResponse = await fetch(proxyUrl);
          if (proxyResponse.ok) {
            const blob = await proxyResponse.blob();
            folder.file(photo.fileName, blob);
          }
        } catch (proxyError) {
          console.warn(`Échec proxy pour ${photo.fileName}:`, proxyError);

        }
      }
    }

    const zipBlob = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: {
        level: 6, // Compression moyenne (0-9)
      },
    });

    const url = window.URL.createObjectURL(zipBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${eventName || "photos"}.zip`;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("Erreur création ZIP:", error);
    return false;
  }
}

export async function trackPhotoDownload(photoId: string) {
  try {
    await fetch(`/api/photos/${photoId}/download`, {
      method: "POST",
    });
  } catch (error) {
    console.error("Erreur tracking download:", error);

  }
}
