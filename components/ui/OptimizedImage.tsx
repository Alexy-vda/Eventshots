"use client";

import Image from "next/image";
import { useState, memo } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  onLoadingComplete?: () => void;
}

/**
 * Composant d'image optimisé avec:
 * - Lazy loading automatique
 * - Blur placeholder
 * - Gestion des erreurs
 * - Skeleton pendant le chargement
 */
export const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  onLoadingComplete,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    onLoadingComplete?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 ${className}`}
      >
        <span className="text-gray-400 text-4xl">📷</span>
      </div>
    );
  }

  return (
    <div
      className={`relative ${isLoading ? "animate-pulse" : ""} ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={!width && !height}
        className={`object-cover transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={handleLoadingComplete}
        onError={handleError}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlNWU3ZWIiLz48L3N2Zz4="
      />
    </div>
  );
});
