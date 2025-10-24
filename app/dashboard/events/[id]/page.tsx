"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PhotoGallery } from "@/components/PhotoGallery";
import { fetchWithAuth } from "@/lib/authClient";
import type { Event, Photo } from "@/types";

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [id, setId] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
        setEvent(data.event);

        // Charger les photos
        fetchPhotos();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    };

    const fetchPhotos = async () => {
      setLoadingPhotos(true);
      try {
        const response = await fetchWithAuth(`/api/photos?eventId=${id}`);

        if (response.ok) {
          const data = await response.json();
          setPhotos(data.photos || []);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des photos:", err);
      } finally {
        setLoadingPhotos(false);
      }
    };

    fetchEvent();
  }, [id, router]);

  const copyShareLink = () => {
    if (!event) return;
    const shareUrl = `${window.location.origin}/events/${event.slug}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!event || !id) return;

    setDeleting(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetchWithAuth(`/api/events/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de la suppression");
      }

      // Rediriger vers le dashboard après suppression
      router.push("/dashboard");
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Erreur lors de la suppression"
      );
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const response = await fetchWithAuth(`/api/photos/${photoId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de la suppression");
      }

      // Retirer la photo de la liste
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Erreur lors de la suppression"
      );
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

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Événement non trouvé
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-terracotta text-white rounded-lg font-medium hover:bg-terracotta/90 transition-colors"
          >
            Retour au dashboard
          </Link>
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
            href="/dashboard"
            className="text-blue-600 hover:text-terracotta font-medium"
          >
            ← Retour au dashboard
          </Link>
        </div>

        {/* Event Info */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl font-bold text-gray-900">{event.title}</h1>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              🗑️ Supprimer
            </button>
          </div>

          {event.description && (
            <p className="text-gray-700 text-lg mb-6">{event.description}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 text-gray-700">
              <span className="text-2xl">📅</span>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">
                  {new Date(event.date).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {event.location && (
              <div className="flex items-center gap-3 text-gray-700">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="text-sm text-gray-500">Lieu</p>
                  <p className="font-medium">{event.location}</p>
                </div>
              </div>
            )}
          </div>

          {/* Share Link */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Lien de partage
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Partagez ce lien avec vos clients pour qu&apos;ils puissent voir
              et télécharger les photos
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={`${
                  typeof window !== "undefined" ? window.location.origin : ""
                }/events/${event.slug}`}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
              />
              <button
                onClick={copyShareLink}
                className="px-6 py-2 bg-terracotta text-white rounded-lg font-medium hover:bg-terracotta/90 transition-colors"
              >
                {copied ? "✓ Copié" : "Copier"}
              </button>
            </div>
          </div>
        </div>

        {/* Photos Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Photos</h2>
              <p className="text-gray-600 text-sm mt-1">
                {photos.length} photo{photos.length !== 1 ? "s" : ""}
              </p>
            </div>
            <Link
              href={`/dashboard/events/${id}/upload`}
              className="px-6 py-3 bg-sage text-white rounded-lg font-medium hover:bg-sage/90 transition-colors"
            >
              + Ajouter des photos
            </Link>
          </div>

          {loadingPhotos ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des photos...</p>
            </div>
          ) : (
            <PhotoGallery
              photos={photos}
              onDelete={handleDeletePhoto}
              showDelete={true}
            />
          )}
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Confirmer la suppression
            </h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer l&apos;événement{" "}
              <strong>{event.title}</strong> ? Cette action est irréversible et
              supprimera également toutes les photos associées.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors"
              >
                {deleting ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
