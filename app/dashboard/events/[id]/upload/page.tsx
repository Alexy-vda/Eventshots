"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UploadDropzone } from "@/lib/uploadthing";
import { fetchWithAuth } from "@/lib/authClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function UploadPhotosPage({ params }: PageProps) {
  const router = useRouter();
  const [id, setId] = useState<string>("");
  const [eventTitle, setEventTitle] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);

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

      setUploadedCount((prev) => prev + 1);
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={`/dashboard/events/${id}`}
            className="text-blue-600 hover:text-terracotta font-medium"
          >
            ← Retour à l&apos;événement
          </Link>
        </div>

        {/* Title */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Uploader des photos
          </h1>
          <p className="text-gray-600">
            Pour l&apos;événement : <strong>{eventTitle}</strong>
          </p>
          {uploadedCount > 0 && (
            <p className="text-green-600 mt-2">
              ✅ {uploadedCount} photo{uploadedCount > 1 ? "s" : ""} uploadée
              {uploadedCount > 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Upload Zone */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Sélectionnez vos photos
            </h2>
            <p className="text-gray-600">
              Vous pouvez uploader jusqu&apos;à 50 photos à la fois. Taille max
              : 16MB par photo.
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
              res?.forEach((file) => {
                savePhotoMetadata(file);
              });

              alert(`${res?.length} photo(s) uploadée(s) avec succès !`);
            }}
            onUploadError={(error: Error) => {
              setUploading(false);
              alert(`Erreur: ${error.message}`);
            }}
            onUploadBegin={() => {
              setUploading(true);
            }}
            config={{
              mode: "auto",
            }}
            appearance={{
              button:
                "bg-terracotta text-white px-6 py-3 rounded-lg font-medium hover:bg-terracotta/90 transition-colors ut-ready:bg-terracotta ut-uploading:bg-terracotta/40",
              container:
                "border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-500 transition-colors",
              allowedContent: "text-gray-600 text-sm",
              label: "text-blue-600 hover:text-terracotta font-medium",
            }}
          />

          {uploading && (
            <div className="mt-6 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
              <p className="text-gray-600">Upload en cours...</p>
            </div>
          )}

          <div className="mt-8 flex gap-4">
            <Link
              href={`/dashboard/events/${id}`}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium text-center hover:bg-gray-50 transition-colors"
            >
              Terminer
            </Link>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-terracotta/10 border border-terracotta/30 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Conseils</h3>
          <ul className="text-sm text-blue-800 space-y-1">
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
