"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ConfirmModal } from "@/components/ui/Modal";
import { fetchWithAuth } from "@/lib/authClient";
import toast from "react-hot-toast";
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

  // Ref pour nettoyer le timeout
  const copiedTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  // Fonction de chargement des photos avec useCallback
  const fetchPhotos = useCallback(async () => {
    if (!id) return;

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
  }, [id]);

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

        // Charger les photos après avoir récupéré l'événement
        await fetchPhotos();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, router, fetchPhotos]);

  // Cleanup du timeout au démontage
  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) {
        clearTimeout(copiedTimeoutRef.current);
      }
    };
  }, []);

  const copyShareLink = async () => {
    if (!event) return;
    const shareUrl = `${window.location.origin}/events/${event.slug}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Lien copié dans le presse-papier !");

      // Nettoyer l'ancien timeout s'il existe
      if (copiedTimeoutRef.current) {
        clearTimeout(copiedTimeoutRef.current);
      }

      copiedTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback avec execCommand pour navigateurs anciens
      try {
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand("copy");
        textArea.remove();

        if (successful) {
          setCopied(true);
          toast.success("Lien copié dans le presse-papier !");

          if (copiedTimeoutRef.current) {
            clearTimeout(copiedTimeoutRef.current);
          }

          copiedTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
        } else {
          throw new Error("Copie échouée");
        }
      } catch (fallbackErr) {
        toast.error(
          "Impossible de copier automatiquement. Copiez ce lien : " + shareUrl,
          { duration: 5000 }
        );
        console.error("Erreur de copie:", err, fallbackErr);
      }
    }
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

      toast.success("Événement supprimé avec succès");
      // Rediriger vers le dashboard après suppression
      router.push("/dashboard");
    } catch (err) {
      toast.error(
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
      toast.success("Photo supprimée avec succès");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erreur lors de la suppression"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#6366f1] border-t-transparent mx-auto mb-4"></div>
          <p className="text-[#666]">Chargement de l&apos;événement...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#fef2f2] rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[#ef4444]"
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
          <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">
            Événement non trouvé
          </h1>
          <p className="text-[#666] mb-6">
            {error || "Cet événement n'existe pas ou a été supprimé."}
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-6 py-3 bg-[#6366f1] text-white rounded-md font-medium hover:bg-[#4f46e5] transition-colors"
          >
            Retour au dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header avec retour */}
        <div className="border-b border-gray-200 px-6 py-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-[#666] hover:text-[#1a1a1a] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Retour</span>
          </Link>
        </div>

        <div className="grid lg:grid-cols-[350px_1fr] min-h-[calc(100vh-73px)]">
          {/* Sidebar gauche - Info événement */}
          <div className="border-r border-gray-200 p-6 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
            {/* Avatar/Cover */}
            <div className="mb-6">
              {photos.length > 0 ? (
                <div className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-200 overflow-hidden">
                  <img
                    src={photos[0].url}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-8 mb-6 pb-6 border-b border-gray-200">
              <div className="text-center">
                <div className="font-bold text-[#1a1a1a] text-xl">{photos.length}</div>
                <div className="text-xs text-[#999]">Photos</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-[#1a1a1a] text-xl">
                  {new Date(event.date).toLocaleDateString("fr-FR", { month: "short" })}
                </div>
                <div className="text-xs text-[#999]">Mois</div>
              </div>
            </div>

            {/* Titre et description */}
            <div className="mb-6">
              <h1 className="text-xl font-bold text-[#1a1a1a] mb-3">{event.title}</h1>
              {event.description && (
                <p className="text-sm text-[#666] leading-relaxed mb-4">
                  {event.description}
                </p>
              )}
            </div>

            {/* Détails */}
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#999] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-xs text-[#999] mb-1">Date</p>
                  <p className="text-sm text-[#1a1a1a] font-medium">
                    {new Date(event.date).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {event.location && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#999] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-xs text-[#999] mb-1">Lieu</p>
                    <p className="text-sm text-[#1a1a1a] font-medium">{event.location}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Lien de partage */}
            <div className="mb-6 p-4 bg-[#fafafa] rounded-lg">
              <p className="text-xs text-[#999] mb-2 font-medium">LIEN DE PARTAGE</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${typeof window !== "undefined" ? window.location.origin : ""}/events/${event.slug}`}
                  className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-md text-xs text-[#666] truncate"
                />
                <button
                  onClick={copyShareLink}
                  className="px-3 py-2 bg-[#1a1a1a] text-white rounded-md text-xs font-medium hover:bg-[#2d2d2d] transition-colors whitespace-nowrap"
                >
                  {copied ? "✓" : "Copier"}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Link
                href={`/dashboard/events/${id}/upload`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#6366f1] text-white rounded-lg font-medium hover:bg-[#4f46e5] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Ajouter des photos
              </Link>
              
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full px-4 py-2 border-2 border-gray-200 text-[#ef4444] rounded-lg font-medium hover:bg-[#fef2f2] transition-colors"
              >
                Supprimer l&apos;événement
              </button>
            </div>
          </div>

          {/* Galerie photos - Droite */}
          <div className="p-6">
            {loadingPhotos ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#6366f1] border-t-transparent mx-auto mb-4"></div>
                  <p className="text-[#666]">Chargement des photos...</p>
                </div>
              </div>
            ) : photos.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <svg className="w-16 h-16 text-[#999] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-[#666] font-medium mb-2">Aucune photo</p>
                  <p className="text-sm text-[#999]">Ajoutez des photos pour commencer</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative aspect-square group">
                    <img
                      src={photo.url}
                      alt="Photo"
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay au survol */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <a
                        href={photo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-10 h-10 bg-white rounded-full hover:scale-110 transition-transform"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="w-5 h-5 text-[#1a1a1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </a>
                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="flex items-center justify-center w-10 h-10 bg-white rounded-full hover:scale-110 transition-transform"
                      >
                        <svg className="w-5 h-5 text-[#ef4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer l'événement "${event.title}" ? Cette action est irréversible et supprimera également toutes les photos associées.`}
        confirmText="Supprimer"
        isLoading={deleting}
        variant="danger"
      />
    </div>
  );
}
