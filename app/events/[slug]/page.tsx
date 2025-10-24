import { prisma } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicPhotoGallery } from "@/components/PublicPhotoGallery";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ISR: Revalider toutes les 60 secondes
export const revalidate = 60;

// Générer les métadonnées dynamiques pour le SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug },
    select: { title: true, description: true, date: true },
  });

  if (!event) {
    return {
      title: "Événement introuvable",
    };
  }

  return {
    title: `${event.title} | EventShot`,
    description:
      event.description ||
      `Découvrez les photos de ${event.title} sur EventShot`,
    openGraph: {
      title: event.title,
      description: event.description || undefined,
      type: "website",
    },
  };
}

export default async function PublicEventPage({ params }: PageProps) {
  const { slug } = await params;

  // Récupérer l'événement depuis la base de données avec ses photos
  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      photos: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-sage/20">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link
            href="/"
            className="text-terracotta hover:text-terracotta/80 font-medium"
          >
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </header>

      {/* Event Info */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-8">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {event.title}
            </h1>

            {event.description && (
              <p className="text-xl text-gray-600 mb-6">{event.description}</p>
            )}

            <div className="flex flex-wrap gap-6 text-gray-700">
              <div className="flex items-center gap-2">
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
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="text-sm text-gray-500">Lieu</p>
                    <p className="font-medium">{event.location}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <span className="text-2xl">📸</span>
                <div>
                  <p className="text-sm text-gray-500">Photographe</p>
                  <p className="font-medium">
                    {event.user.name || event.user.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <p className="text-gray-600 text-sm">
              Événement créé le{" "}
              {new Date(event.createdAt).toLocaleDateString("fr-FR")}
            </p>
          </div>
        </div>

        {/* Photos Gallery */}
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <PublicPhotoGallery
            photos={event.photos.map((photo) => ({
              ...photo,
              createdAt: photo.createdAt.toISOString(),
            }))}
            eventId={event.id}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-600">
          <p>
            Propulsé par{" "}
            <Link
              href="/"
              className="text-blue-600 hover:text-terracotta font-medium"
            >
              EventShot
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
