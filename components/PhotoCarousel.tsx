"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import type { Photo } from "@/types";

interface PhotoCarouselProps {
  photos: Photo[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onDownload?: (photo: Photo) => void;
}

export default function PhotoCarousel({
  photos,
  initialIndex,
  isOpen,
  onClose,
  onDownload,
}: PhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (!isOpen || photos.length <= 1) return;

    const prevIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1;
    const nextIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0;

    [prevIndex, nextIndex].forEach((idx) => {
      const photo = photos[idx];

      const imageUrl = photo.displayUrl || photo.url;
      const optimizedUrl = `/_next/image?url=${encodeURIComponent(
        imageUrl
      )}&w=1920&q=75`;

      const link = document.createElement("link");
      link.rel = "prefetch";
      link.as = "image";
      link.href = optimizedUrl;
      document.head.appendChild(link);
    });
  }, [currentIndex, isOpen, photos]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
          break;
        case "ArrowRight":
          setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
          break;
      }
    },
    [isOpen, onClose, photos.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload(photos[currentIndex]);
    }
  };

  if (!isOpen) return null;

  const currentPhoto = photos[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white"
        aria-label="Fermer"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium">
        {currentIndex + 1} / {photos.length}
      </div>

      {onDownload && (
        <button
          onClick={handleDownload}
          className="absolute top-4 left-4 z-10 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-2 text-white text-sm font-medium"
          aria-label="Télécharger la photo"
        >
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
          Télécharger
        </button>
      )}

      {photos.length > 1 && (
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white"
          aria-label="Photo précédente"
        >
          <svg
            className="w-6 h-6"
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

      <div className="relative w-full h-full flex items-center justify-center p-4">
        <div className="relative w-full h-full max-w-7xl max-h-[90vh]">
          <Image
            src={currentPhoto.displayUrl || currentPhoto.url}
            alt={currentPhoto.fileName}
            fill
            className="object-contain"
            sizes="(max-width: 1920px) 100vw, 1920px"
            quality={75}
            priority
            placeholder={currentPhoto.blurDataUrl ? "blur" : "empty"}
            blurDataURL={currentPhoto.blurDataUrl || undefined}
          />
        </div>
      </div>

      {photos.length > 1 && (
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white"
          aria-label="Photo suivante"
        >
          <svg
            className="w-6 h-6"
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

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-6 py-3 rounded-lg bg-white/10 backdrop-blur-sm text-white text-center max-w-2xl">
        <p className="text-sm font-medium truncate">{currentPhoto.fileName}</p>
        <p className="text-xs text-white/70 mt-1">
          {currentPhoto.width} × {currentPhoto.height} •{" "}
          {(currentPhoto.fileSize / (1024 * 1024)).toFixed(2)} MB
        </p>
      </div>
    </div>
  );
}
