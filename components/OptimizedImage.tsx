"use client";

import { useState } from "react";
import Image from "next/image";

interface OptimizedImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
  quality?: number;
  onClick?: (e: React.MouseEvent) => void;
}

export function OptimizedImage({
  src,
  alt,
  fill = false,
  width,
  height,
  priority = false,
  className = "",
  sizes,
  quality = 75,
  onClick,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 ${className}`}
        onClick={onClick}
      >
        <div className="text-center p-4">
          <div className="text-4xl mb-2">🖼️</div>
          <p className="text-sm text-gray-500">Image indisponible</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div
          className={`absolute inset-0 bg-gray-200 animate-pulse ${className}`}
        />
      )}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={width}
        height={height}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
        className={`${className} ${
          isLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300`}
        sizes={sizes}
        quality={quality}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        onClick={onClick}
      />
    </>
  );
}
