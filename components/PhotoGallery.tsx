"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import type { Photo } from "@/types";

interface PhotoGalleryProps {
  photos: Photo[];
  onDelete?: (photoId: string) => void;
  showDelete?: boolean;
}

export function PhotoGallery({
  photos,
  onDelete,
  showDelete = false,
}: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deletedPhotos, setDeletedPhotos] = useState<Set<string>>(new Set());
  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Optimistic UI: filter out deleted photos
  const visiblePhotos = useMemo(
    () => photos.filter((photo) => !deletedPhotos.has(photo.id)),
    [photos, deletedPhotos]
  );

  // Navigation entre photos
  const currentPhotoIndex = useMemo(() => {
    if (!selectedPhoto) return -1;
    return visiblePhotos.findIndex((p) => p.id === selectedPhoto.id);
  }, [selectedPhoto, visiblePhotos]);

  // Support navigation clavier (flèches gauche/droite, Escape)
  useEffect(() => {
    if (!selectedPhoto || currentPhotoIndex === -1) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        const prevIndex =
          (currentPhotoIndex - 1 + visiblePhotos.length) % visiblePhotos.length;
        setSelectedPhoto(visiblePhotos[prevIndex]);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        const nextIndex = (currentPhotoIndex + 1) % visiblePhotos.length;
        setSelectedPhoto(visiblePhotos[nextIndex]);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setSelectedPhoto(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhoto, currentPhotoIndex, visiblePhotos]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteClick = (photoId: string) => {
    setPhotoToDelete(photoId);
  };

  const confirmDelete = async () => {
    if (!photoToDelete || !onDelete) return;

    const photoId = photoToDelete;
    setPhotoToDelete(null);

    // Optimistic update: immediately remove from UI
    setDeletedPhotos((prev) => new Set(prev).add(photoId));
    setDeleting(photoId);

    try {
      await onDelete(photoId);
      showToast("Photo supprimée avec succès", "success");
    } catch {
      // Rollback on error: restore photo in UI
      setDeletedPhotos((prev) => {
        const next = new Set(prev);
        next.delete(photoId);
        return next;
      });
      showToast("Erreur lors de la suppression", "error");
    } finally {
      setDeleting(null);
    }
  };

  const cancelDelete = () => {
    setPhotoToDelete(null);
  };
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  if (visiblePhotos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📷</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Aucune photo
        </h3>
        <p className="text-gray-500">
          Commencez à uploader vos photos pour cet événement
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Toast notifications */}
      {toast && (
        <div className="fixed top-4 right-4 z-60 animate-slide-in">
          <div
            className={`px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 ${
              toast.type === "success"
                ? "bg-sage text-white"
                : "bg-terracotta text-white"
            }`}
          >
            <span className="text-2xl">
              {toast.type === "success" ? "✓" : "⚠️"}
            </span>
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Grid de photos */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {visiblePhotos.map((photo, index) => (
          <div
            key={photo.id}
            className="relative group aspect-square bg-cream rounded-lg overflow-hidden cursor-pointer animate-pulse border-2 border-sage/10"
            onClick={() => setSelectedPhoto(photo)}
          >
            {/* Image */}
            <Image
              src={photo.thumbnailUrl || photo.url}
              alt={photo.fileName}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-all group-hover:scale-110 group-hover:brightness-75"
              priority={index < 8}
              loading={index < 8 ? undefined : "lazy"}
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmNGYxZGUiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNmMmNjOGYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg=="
              onLoadingComplete={(img) => {
                img.parentElement?.classList.remove("animate-pulse");
              }}
            />

            {/* Overlay on hover - Desktop only */}
            <div className="absolute inset-0 hidden md:flex items-center justify-center pointer-events-none">
              <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium transition-opacity bg-navy bg-opacity-70 px-4 py-2 rounded-lg">
                Voir
              </span>
            </div>

            {/* Explicit deletion overlay - visible without hover */}
            {deleting === photo.id && (
              <div className="absolute inset-0 bg-navy bg-opacity-80 flex flex-col items-center justify-center z-30 pointer-events-none">
                <div className="animate-spin text-5xl mb-2">⏳</div>
                <span className="text-white font-semibold text-sm">
                  Suppression...
                </span>
              </div>
            )}

            {/* Delete button - Always visible on mobile, hover on desktop */}
            {showDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleDeleteClick(photo.id);
                }}
                disabled={deleting === photo.id}
                className="absolute top-2 right-2 p-2 sm:p-2.5 bg-terracotta text-white rounded-2xl shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-terracotta/90 disabled:bg-terracotta/40 disabled:opacity-50 z-20 pointer-events-auto transition-all hover:scale-110"
                type="button"
                title="Supprimer cette photo"
                aria-label="Supprimer cette photo"
              >
                🗑️
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Modal de prévisualisation */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
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
          {visiblePhotos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                const prevIndex =
                  (currentPhotoIndex - 1 + visiblePhotos.length) %
                  visiblePhotos.length;
                setSelectedPhoto(visiblePhotos[prevIndex]);
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
          {visiblePhotos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                const nextIndex =
                  (currentPhotoIndex + 1) % visiblePhotos.length;
                setSelectedPhoto(visiblePhotos[nextIndex]);
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
                  {visiblePhotos.length > 1 && (
                    <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                      {currentPhotoIndex + 1} / {visiblePhotos.length}
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
                  {" • "}
                  {selectedPhoto.downloadCount} téléchargement
                  {selectedPhoto.downloadCount !== 1 ? "s" : ""}
                </p>
              </div>
              <a
                href={selectedPhoto.url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-sage text-white rounded-lg font-semibold hover:bg-sage/90 transition-all whitespace-nowrap"
                onClick={(e) => e.stopPropagation()}
              >
                Télécharger
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Modale de confirmation de suppression */}
      {photoToDelete && (
        <div className="fixed inset-0 bg-navy/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 border-2 border-terracotta/20">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🗑️</div>
              <h3 className="font-serif text-2xl font-bold text-navy mb-2">
                Supprimer cette photo ?
              </h3>
              <p className="text-navy/70">
                Cette action est irréversible. La photo sera définitivement
                supprimée.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 px-4 py-3 border-2 border-sage/30 rounded-lg text-navy font-medium hover:bg-sage/10 transition-all"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                disabled={!!deleting}
                className="flex-1 px-4 py-3 bg-terracotta text-white rounded-lg font-semibold hover:bg-terracotta/90 disabled:bg-terracotta/40 disabled:cursor-not-allowed transition-all"
              >
                {deleting ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
