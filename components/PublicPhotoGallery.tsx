"use client";

import { useState } from "react";
import Image from "next/image";
import PhotoCarousel from "./PhotoCarousel";
import toast from "react-hot-toast";
import {
  downloadSinglePhoto,
  downloadPhotosAsZip,
  trackPhotoDownload,
} from "@/lib/downloads";
import type { Photo } from "@/types";

interface PublicPhotoGalleryProps {
  photos: Photo[];
  eventName: string;
}

export function PublicPhotoGallery({
  photos,
  eventName,
}: PublicPhotoGalleryProps) {
  const [showCarousel, setShowCarousel] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [zipProgress, setZipProgress] = useState({ current: 0, total: 0 });

  const handlePhotoClick = (index: number) => {
    setSelectedPhotoIndex(index);
    setShowCarousel(true);
  };

  const handleDownloadPhoto = async (photo: Photo) => {
    try {
      await trackPhotoDownload(photo.id);
      const success = await downloadSinglePhoto(photo);
      if (success) {
        toast.success("Téléchargement lancé");
      } else {
        toast.error("Erreur lors du téléchargement");
      }
    } catch (err) {
      toast.error("Erreur lors du téléchargement");
      console.error(err);
    }
  };

  const handleDownloadAll = async () => {
    if (photos.length === 0) return;

    const confirmed = window.confirm(
      `Télécharger toutes les ${photos.length} photos dans un fichier ZIP ?`
    );
    if (!confirmed) return;

    setDownloadingZip(true);
    setZipProgress({ current: 0, total: photos.length });

    toast.loading(`Préparation du téléchargement...`, {
      id: "download-all",
    });

    try {
      const success = await downloadPhotosAsZip(
        photos,
        eventName,
        (current, total) => {
          setZipProgress({ current, total });
          toast.loading(
            `Téléchargement: ${current}/${total} photos ajoutées au ZIP`,
            { id: "download-all" }
          );
        }
      );

      if (success) {
        toast.success(
          `${photos.length} ${
            photos.length > 1 ? "photos téléchargées" : "photo téléchargée"
          }`,
          { id: "download-all" }
        );
      } else {
        toast.error("Erreur lors de la création du ZIP", {
          id: "download-all",
        });
      }
    } catch (err) {
      toast.error("Erreur lors du téléchargement", { id: "download-all" });
      console.error(err);
    } finally {
      setDownloadingZip(false);
      setZipProgress({ current: 0, total: 0 });
    }
  };

  if (photos.length === 0) {
    return (
      <div className="text-center py-32">
        <div className="w-24 h-24 mx-auto mb-8 flex items-center justify-center">
          <svg
            className="w-24 h-24 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          Aucune photo pour le moment
        </h3>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          Le photographe n&apos;a pas encore partagé les photos de cet événement
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-24 right-6 z-40">
        <button
          onClick={handleDownloadAll}
          disabled={downloadingZip}
          className="flex items-center gap-2 px-5 py-2.5 bg-white backdrop-blur-sm text-gray-900 rounded-full font-medium hover:bg-gray-50 shadow-lg hover:shadow-xl disabled:bg-gray-300 disabled:cursor-not-allowed transition-all border border-gray-200"
        >
          {downloadingZip ? (
            <>
              <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">
                {zipProgress.current}/{zipProgress.total}
              </span>
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span className="text-sm font-medium">Télécharger tout</span>
            </>
          )}
        </button>
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3">
        {photos.map((photo, index) => {
          return (
            <div
              key={photo.id}
              onClick={() => handlePhotoClick(index)}
              className="relative group break-inside-avoid mb-3 cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handlePhotoClick(index);
                }
              }}
            >
              <div className="relative overflow-hidden">
                <Image
                  src={photo.displayUrl || photo.url}
                  alt={photo.fileName}
                  width={photo.width || 800}
                  height={photo.height || 600}
                  priority={index < 8}
                  className="w-full h-auto transition-all duration-500 group-hover:opacity-90"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  quality={75}
                  placeholder={photo.blurDataUrl ? "blur" : "empty"}
                  blurDataURL={photo.blurDataUrl || undefined}
                />

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-100 scale-95">
                    <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                      <svg
                        className="w-6 h-6 text-gray-900"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <PhotoCarousel
        photos={photos}
        initialIndex={selectedPhotoIndex}
        isOpen={showCarousel}
        onClose={() => setShowCarousel(false)}
        onDownload={handleDownloadPhoto}
      />
    </>
  );
}
