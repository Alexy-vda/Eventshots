"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import type { Photo } from "@/types";

interface PublicPhotoGalleryProps {
  photos: Photo[];
  eventId?: string; // Optionnel, pour un usage futur si nécessaire
}

export function PublicPhotoGallery({ photos }: PublicPhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [downloading, setDownloading] = useState(false);

  // Index de la photo actuellement sélectionnée
  const currentPhotoIndex = useMemo(() => {
    if (!selectedPhoto) return -1;
    return photos.findIndex((p) => p.id === selectedPhoto.id);
  }, [selectedPhoto, photos]);

  // Support navigation clavier (flèches gauche/droite, Escape)
  useEffect(() => {
    if (!selectedPhoto || currentPhotoIndex === -1) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        const prevIndex =
          (currentPhotoIndex - 1 + photos.length) % photos.length;
        setSelectedPhoto(photos[prevIndex]);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        const nextIndex = (currentPhotoIndex + 1) % photos.length;
        setSelectedPhoto(photos[nextIndex]);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setSelectedPhoto(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhoto, currentPhotoIndex, photos]);

  const handleDownload = async (photo: Photo) => {
    try {
      setDownloading(true);

      // Ouvrir l'image dans un nouvel onglet pour le téléchargement
      window.open(photo.url, "_blank");

      // Incrémenter le compteur de téléchargements
      await fetch(`/api/photos/${photo.id}/download`, {
        method: "POST",
      });
    } catch (err) {
      console.error("Erreur lors du téléchargement:", err);
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadAll = async () => {
    if (photos.length === 0) return;

    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="font-medium">
            Télécharger {photos.length} photo{photos.length > 1 ? "s" : ""} ?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                proceedDownloadAll();
              }}
              className="px-4 py-2 bg-[#6366f1] text-white rounded-md font-medium hover:bg-[#4f46e5] transition-colors"
            >
              Confirmer
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 bg-[#fafafa] rounded-md text-gray-700 font-medium hover:bg-[#f0f0f0] transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
      }
    );
  };

  const proceedDownloadAll = async () => {
    setDownloading(true);
    toast.loading("Téléchargement en cours...", { id: "download-all" });

    try {
      // Télécharger chaque photo une par une
      for (const photo of photos) {
        window.open(photo.url, "_blank");
        await new Promise((resolve) => setTimeout(resolve, 500)); // Délai pour éviter le blocage des popups
      }

      toast.success(
        `${photos.length} photo${photos.length > 1 ? "s" : ""} téléchargée${
          photos.length > 1 ? "s" : ""
        }`,
        { id: "download-all" }
      );
    } catch {
      toast.error("Erreur lors du téléchargement", { id: "download-all" });
    } finally {
      setDownloading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  if (photos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-lg flex items-center justify-center">
          <svg
            className="w-10 h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold text-gray-700 mb-3">
          Aucune photo disponible
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Le photographe n&apos;a pas encore uploadé les photos de cet
          événement. Revenez plus tard !
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Header avec bouton télécharger tout */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Galerie de photos
          </h2>
          <p className="text-gray-600 mt-1">
            {photos.length} photo{photos.length > 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={handleDownloadAll}
          disabled={downloading}
          className="px-4 py-2 bg-[#6366f1] text-white rounded-md font-medium hover:bg-[#4f46e5] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {downloading ? "Téléchargement..." : "Télécharger tout"}
        </button>
      </div>

      {/* Grid de photos */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="relative group aspect-square bg-[#fafafa] rounded-lg overflow-hidden cursor-pointer animate-pulse border border-gray-100"
            onClick={() => setSelectedPhoto(photo)}
          >
            <Image
              src={photo.thumbnailUrl || photo.url}
              alt={photo.fileName}
              fill
              priority={index < 8}
              className="object-cover transition-all group-hover:scale-105 group-hover:brightness-90"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              quality={75}
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmM2Y0ZjYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlNWU3ZWIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg=="
              onLoadingComplete={(img) => {
                img.parentElement?.classList.remove("animate-pulse");
              }}
            />

            {/* Texte "Voir" au hover - Desktop only */}
            <div className="absolute inset-0 hidden md:flex items-center justify-center pointer-events-none">
              <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium transition-opacity bg-black bg-opacity-60 px-4 py-2 rounded-md">
                Voir
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de prévisualisation */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          {/* Bouton fermer */}
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-10 transition-colors"
            aria-label="Fermer"
          >
            ×
          </button>

          {/* Navigation précédent (visible si plusieurs photos) */}
          {photos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                const prevIndex =
                  (currentPhotoIndex - 1 + photos.length) % photos.length;
                setSelectedPhoto(photos[prevIndex]);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-4 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full transition-all hover:scale-110"
              aria-label="Photo précédente"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Navigation suivant (visible si plusieurs photos) */}
          {photos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                const nextIndex = (currentPhotoIndex + 1) % photos.length;
                setSelectedPhoto(photos[nextIndex]);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-4 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full transition-all hover:scale-110"
              aria-label="Photo suivante"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}

          <div className="max-w-7xl max-h-[90vh] w-full h-full relative">
            <Image
              src={selectedPhoto.url}
              alt={selectedPhoto.fileName}
              fill
              priority
              className="object-contain"
              onClick={(e) => e.stopPropagation()}
              quality={90}
              sizes="100vw"
            />
          </div>

          {/* Info bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-4">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <p className="font-medium">{selectedPhoto.fileName}</p>
                  {photos.length > 1 && (
                    <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                      {currentPhotoIndex + 1} / {photos.length}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-300">
                  {formatFileSize(selectedPhoto.fileSize)}
                  {selectedPhoto.width && selectedPhoto.height && (
                    <>
                      {" "}
                      • {selectedPhoto.width} × {selectedPhoto.height}px
                    </>
                  )}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(selectedPhoto);
                }}
                disabled={downloading}
                className="px-4 py-2 bg-[#6366f1] text-white rounded-md font-medium hover:bg-[#4f46e5] disabled:bg-gray-300 transition-colors whitespace-nowrap"
              >
                {downloading ? "Téléchargement..." : "Télécharger"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
