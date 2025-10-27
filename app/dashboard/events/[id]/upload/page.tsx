"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { R2Upload } from "@/components/R2Upload";
import { fetchWithAuth } from "@/lib/authClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function UploadPhotosPage({ params }: PageProps) {
  const router = useRouter();
  const [id, setId] = useState<string>("");
  const [eventTitle, setEventTitle] = useState<string>("");
  const [loading, setLoading] = useState(true);

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
        <div className="mb-6">
          <Link
            href={`/dashboard/events/${id}`}
            className="text-[#6366f1] hover:text-[#4f46e5] font-medium"
          >
            ← Retour à l&apos;événement
          </Link>
        </div>

        <div className="bg-white rounded-lg p-8 mb-6">
          <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">
            Uploader des photos
          </h1>
          <p className="text-[#666]">
            Pour l&apos;événement : <strong>{eventTitle}</strong>
          </p>
        </div>

        <div className="bg-white rounded-lg p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">
              Sélectionnez vos photos
            </h2>
            <p className="text-[#666]">
              Vous pouvez uploader jusqu&apos;à 50 photos à la fois. Formats
              supportés : JPG, PNG, WebP.
            </p>
          </div>

          <R2Upload eventId={id} />

          <div className="mt-8 flex gap-4">
            <Link
              href={`/dashboard/events/${id}`}
              className="flex-1 px-4 py-2 bg-[#fafafa] rounded-md text-[#1a1a1a] font-medium text-center hover:bg-[#f0f0f0] transition-colors"
            >
              Voir l&apos;événement
            </Link>
          </div>
        </div>

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
