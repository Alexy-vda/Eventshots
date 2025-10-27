"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { ConfirmModal } from "@/components/ui/Modal";
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

  const visiblePhotos = useMemo(
    () => photos.filter((photo) => !deletedPhotos.has(photo.id)),
    [photos, deletedPhotos]
  );

  const currentPhotoIndex = useMemo(() => {
    if (!selectedPhoto) return -1;
    return visiblePhotos.findIndex((p) => p.id === selectedPhoto.id);
  }, [selectedPhoto, visiblePhotos]);

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

  const handleDeleteClick = (photoId: string) => {
    setPhotoToDelete(photoId);
  };

  const confirmDelete = async () => {
    if (!photoToDelete || !onDelete) return;

    const photoId = photoToDelete;
    setPhotoToDelete(null);

    setDeletedPhotos((prev) => new Set(prev).add(photoId));
    setDeleting(photoId);

    try {
      await onDelete(photoId);
    } catch {
      setDeletedPhotos((prev) => {
        const next = new Set(prev);
        next.delete(photoId);
        return next;
      });
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
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-400"
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {visiblePhotos.map((photo, index) => (
          <div
            key={photo.id}
            className="relative group aspect-square bg-[#fafafa] rounded-lg overflow-hidden cursor-pointer animate-pulse border border-gray-100"
            onClick={() => setSelectedPhoto(photo)}
          >
            <Image
              src={photo.thumbnailUrl || photo.url}
              alt={photo.fileName}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-all group-hover:scale-105 group-hover:brightness-90"
              priority={index < 8}
              loading={index < 8 ? undefined : "lazy"}
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmNGYxZGUiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNmMmNjOGYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg=="
              onLoadingComplete={(img) => {
                img.parentElement?.classList.remove("animate-pulse");
              }}
            />

            <div className="absolute inset-0 hidden md:flex items-center justify-center pointer-events-none">
              <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium transition-opacity bg-black bg-opacity-60 px-4 py-2 rounded-md">
                Voir
              </span>
            </div>

            {deleting === photo.id && (
              <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-30 pointer-events-none">
                <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                <span className="text-white font-semibold text-sm">
                  Suppression...
                </span>
              </div>
            )}

            {showDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleDeleteClick(photo.id);
                }}
                disabled={deleting === photo.id}
                className="absolute top-2 right-2 p-2 sm:p-2.5 bg-[#ef4444] text-white rounded-md opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-[#dc2626] disabled:bg-gray-300 disabled:opacity-50 z-20 pointer-events-auto transition-all"
                type="button"
                title="Supprimer cette photo"
                aria-label="Supprimer cette photo"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-10 transition-colors"
            aria-label="Fermer"
          >
            ×
          </button>

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
                className="px-4 py-2 bg-[#6366f1] text-white rounded-md font-medium hover:bg-[#4f46e5] transition-colors whitespace-nowrap"
                onClick={(e) => e.stopPropagation()}
              >
                Télécharger
              </a>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!photoToDelete}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Supprimer cette photo ?"
        message="Cette action est irréversible. La photo sera définitivement supprimée."
        variant="danger"
        isLoading={!!deleting}
      />
    </>
  );
}
