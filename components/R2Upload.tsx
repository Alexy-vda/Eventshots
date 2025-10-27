"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";

interface R2UploadProps {
  eventId: string;
  onUploadComplete?: () => void;
}

interface FilePreview {
  file: File;
  preview: string;
  blurDataUrl?: string;
  status: "pending" | "uploading" | "success" | "error";
  progress: number;
}

async function generateBlurDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = document.createElement("img");
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = 10;
        canvas.height = 10;

        ctx?.drawImage(img, 0, 0, 10, 10);
        resolve(canvas.toDataURL("image/jpeg", 0.1));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function R2Upload({ eventId, onUploadComplete }: R2UploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const router = useRouter();

  const uploadFiles = useCallback(
    async (files: FileList) => {
      if (files.length === 0) return;

      const imageFiles = Array.from(files).filter((file) =>
        file.type.startsWith("image/")
      );

      if (imageFiles.length === 0) {
        toast.error("Veuillez sélectionner uniquement des images");
        return;
      }

      if (imageFiles.length > 50) {
        toast.error("Maximum 50 images à la fois");
        return;
      }

      const previews: FilePreview[] = imageFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        status: "pending",
        progress: 0,
      }));

      setFilePreviews(previews);
      setUploading(true);
      setOverallProgress(0);

      try {
        const previewsWithBlur = await Promise.all(
          previews.map(async (preview) => {
            const blurDataUrl = await generateBlurDataUrl(preview.file);
            return {
              ...preview,
              blurDataUrl,
              status: "uploading" as const,
            };
          })
        );

        setFilePreviews(previewsWithBlur);

        const formData = new FormData();
        formData.append("eventId", eventId);

        previewsWithBlur.forEach((preview) => {
          formData.append("files", preview.file); // Fichier original
          if (preview.blurDataUrl) {
            formData.append("blurDataUrls", preview.blurDataUrl);
          }
        });

        const token = localStorage.getItem("access_token");

        if (!token) {
          toast.error("Vous devez être connecté");
          router.push("/login");
          return;
        }

        const progressInterval = setInterval(() => {
          setOverallProgress((prev) => {
            if (prev >= 90) return prev;
            return prev + 5;
          });
        }, 200);

        const response = await fetch("/api/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        clearInterval(progressInterval);

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Erreur lors de l'upload");
        }

        const data = await response.json();

        setOverallProgress(100);

        setFilePreviews((prev) =>
          prev.map((p) => ({ ...p, status: "success", progress: 100 }))
        );

        toast.success(
          `${data.photos.length} photo(s) uploadée(s) avec succès !`
        );

        setTimeout(() => {
          onUploadComplete?.();
          router.refresh();
        }, 1500);
      } catch (error) {
        console.error("Erreur upload:", error);

        setFilePreviews((prev) => prev.map((p) => ({ ...p, status: "error" })));

        toast.error(
          error instanceof Error ? error.message : "Erreur lors de l'upload"
        );
      } finally {
        setUploading(false);
      }
    },
    [eventId, router, onUploadComplete]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        uploadFiles(e.dataTransfer.files);
      }
    },
    [uploadFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        uploadFiles(e.target.files);
      }
    },
    [uploadFiles]
  );

  return (
    <div className="w-full space-y-6">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-12 text-center
          transition-colors duration-200
          ${
            dragActive
              ? "border-[#6366f1] bg-[#6366f1]/5"
              : "border-gray-300 bg-white"
          }
          ${uploading ? "opacity-50 pointer-events-none" : "cursor-pointer"}
        `}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-lg font-medium text-gray-700 mb-2">
            Glissez-déposez vos photos ici
          </p>
          <p className="text-sm text-gray-500">
            ou cliquez pour parcourir (max 50 images à la fois)
          </p>
        </label>
      </div>

      {filePreviews.length > 0 && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4">
            Fichiers sélectionnés ({filePreviews.length})
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filePreviews.map((filePreview, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 bg-[#fafafa] rounded-lg border border-gray-100"
              >
                <div className="relative w-16 h-16 shrink-0 rounded-md overflow-hidden bg-gray-200">
                  <Image
                    src={filePreview.preview}
                    alt={filePreview.file.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                    placeholder={filePreview.blurDataUrl ? "blur" : "empty"}
                    blurDataURL={filePreview.blurDataUrl}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1a1a1a] truncate">
                    {filePreview.file.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>
                      {(filePreview.file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  {filePreview.status === "pending" && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  )}
                  {filePreview.status === "uploading" && (
                    <div className="w-8 h-8 rounded-full border-2 border-[#6366f1] border-t-transparent animate-spin" />
                  )}
                  {filePreview.status === "success" && (
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                  {filePreview.status === "error" && (
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-red-600"
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
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
