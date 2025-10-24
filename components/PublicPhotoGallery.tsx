"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
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

    const confirmed = confirm(
      `Télécharger ${photos.length} photo${photos.length > 1 ? "s" : ""} ?`
    );

    if (!confirmed) return;

    setDownloading(true);

    // Télécharger chaque photo une par une
    for (const photo of photos) {
      window.open(photo.url, "_blank");
      await new Promise((resolve) => setTimeout(resolve, 500)); // Délai pour éviter le blocage des popups
    }

    setDownloading(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  if (photos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-300 text-8xl mb-6">📷</div>
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
          className="px-6 py-3 bg-terracotta text-white rounded-lg font-medium hover:bg-terracotta/90 disabled:bg-terracotta/40 disabled:cursor-not-allowed transition-colors"
        >
          {downloading ? "Téléchargement..." : "📥 Télécharger tout"}
        </button>
      </div>

      {/* Grid de photos */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="relative group aspect-square bg-cream rounded-lg overflow-hidden cursor-pointer animate-pulse border-2 border-sage/10"
            onClick={() => setSelectedPhoto(photo)}
          >
            <Image
              src={photo.thumbnailUrl || photo.url}
              alt={photo.fileName}
              fill
              priority={index < 8}
              className="object-cover transition-all group-hover:scale-110 group-hover:brightness-75"
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
              <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium transition-opacity bg-black bg-opacity-50 px-4 py-2 rounded-lg">
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
                className="px-6 py-2 bg-terracotta text-white rounded-lg font-medium hover:bg-terracotta/90 disabled:bg-terracotta/40 transition-colors whitespace-nowrap"
              >
                {downloading ? "Téléchargement..." : "📥 Télécharger"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
