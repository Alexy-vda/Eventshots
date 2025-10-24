"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UploadDropzone } from "@/lib/uploadthing";
import { fetchWithAuth } from "@/lib/authClient";
import toast from "react-hot-toast";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface UploadedFile {
  name: string;
  url: string;
  size: number;
}

export default function UploadPhotosPage({ params }: PageProps) {
  const router = useRouter();
  const [id, setId] = useState<string>("");
  const [eventTitle, setEventTitle] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetchWithAuth(`/api/events/${id}`);

        if (!response.ok) {
          throw new Error("Événement non trouvé");
        }

        const data = await response.json();
        setEventTitle(data.event.title);
      } catch (err) {
        console.error(err);
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, router]);

  const savePhotoMetadata = async (file: {
    url: string;
    name: string;
    size: number;
  }) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      await fetchWithAuth("/api/photos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: id,
          url: file.url,
          fileName: file.name,
          fileSize: file.size,
        }),
      });
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={`/dashboard/events/${id}`}
            className="text-[#6366f1] hover:text-[#4f46e5] font-medium"
          >
            ← Retour à l&apos;événement
          </Link>
        </div>

        {/* Title */}
        <div className="bg-white rounded-lg p-8 mb-6">
          <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">
            Uploader des photos
          </h1>
          <p className="text-[#666]">
            Pour l&apos;événement : <strong>{eventTitle}</strong>
          </p>
          {uploadedFiles.length > 0 && (
            <div className="mt-4 p-4 bg-[#f0fdf4] rounded-md">
              <p className="text-[#22c55e] font-semibold">
                {uploadedFiles.length} photo
                {uploadedFiles.length > 1 ? "s" : ""} uploadée
                {uploadedFiles.length > 1 ? "s" : ""} lors de cette session
              </p>
            </div>
          )}
        </div>

        {/* Upload Zone */}
        <div className="bg-white rounded-lg p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">
              Sélectionnez vos photos
            </h2>
            <p className="text-[#666]">
              Vous pouvez uploader jusqu&apos;à 50 photos à la fois. Taille max
              : 32MB par photo.
            </p>
          </div>

          <UploadDropzone
            endpoint="eventImageUploader"
            headers={() => {
              const token = localStorage.getItem("access_token");
              return {
                authorization: `Bearer ${token}`,
              };
            }}
            onClientUploadComplete={(res) => {
              setUploading(false);
              console.log("Files uploaded:", res);

              // Sauvegarder les métadonnées de chaque fichier
              if (res && res.length > 0) {
                // Ajouter les fichiers à la liste
                const newFiles = res.map((file) => ({
                  name: file.name,
                  url: file.url,
                  size: file.size,
                }));
                setUploadedFiles((prev) => [...prev, ...newFiles]);

                // Sauvegarder en base de données
                res.forEach((file) => {
                  savePhotoMetadata(file);
                });

                toast.success(
                  `${res.length} photo${res.length > 1 ? "s" : ""} uploadée${
                    res.length > 1 ? "s" : ""
                  } avec succès !`
                );
              }
            }}
            onUploadError={(error: Error) => {
              setUploading(false);
              toast.error(`Erreur d'upload: ${error.message}`);
            }}
            onUploadBegin={() => {
              setUploading(true);
            }}
            config={{
              mode: "auto",
            }}
            appearance={{
              button: "hidden",
              container:
                "bg-[#fafafa] rounded-lg p-8 hover:bg-[#f5f5f5] transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[200px]",
              allowedContent: "text-[#666] text-sm",
              label:
                "text-[#6366f1] hover:text-[#4f46e5] font-medium cursor-pointer",
            }}
          />

          {uploading && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#6366f1] border-t-transparent"></div>
              <p className="text-[#1a1a1a] font-medium">Upload en cours...</p>
            </div>
          )}

          {/* Liste des photos uploadées */}
          {uploadedFiles.length > 0 && (
            <div className="mt-6 pt-6 border-t border-[#f0f0f0]">
              <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4">
                Photos uploadées ({uploadedFiles.length})
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={`${file.url}-${index}`}
                    className="flex items-center gap-3 p-3 bg-[#fafafa] rounded-md"
                  >
                    <div className="shrink-0 w-10 h-10 bg-[#f0fdf4] rounded-md flex items-center justify-center">
                      <span className="text-[#22c55e] text-lg">✓</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1a1a1a] truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-[#999]">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-4">
            <Link
              href={`/dashboard/events/${id}`}
              className="flex-1 px-4 py-2 bg-[#fafafa] rounded-md text-[#1a1a1a] font-medium text-center hover:bg-[#f0f0f0] transition-colors"
            >
              Terminer
            </Link>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-[#fafafa] rounded-lg p-6">
          <h3 className="font-semibold text-[#1a1a1a] mb-2">Conseils</h3>
          <ul className="text-sm text-[#666] space-y-1">
            <li>
              • Utilisez des images de haute qualité pour une meilleure
              expérience
            </li>
            <li>• Les photos sont automatiquement optimisées pour le web</li>
            <li>
              • Vos clients pourront télécharger les photos en pleine résolution
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
