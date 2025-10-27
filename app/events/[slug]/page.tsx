import { prisma } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicPhotoGallery } from "@/components/PublicPhotoGallery";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

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
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-30">
        <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-gray-900 hover:text-gray-600 font-medium text-sm flex items-center gap-2 transition-colors"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Retour
          </Link>
          <div className="text-center">
            <h1 className="text-lg font-semibold text-gray-900">
              {event.title}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {event.photos.length} photo{event.photos.length > 1 ? "s" : ""}
            </p>
          </div>
          <div className="w-20"></div> {}
        </div>
      </header>

      <main className="pt-20 px-6 pb-12 max-w-screen-2xl mx-auto">
        <PublicPhotoGallery
          photos={event.photos.map((photo) => ({
            ...photo,
            createdAt: photo.createdAt.toISOString(),
          }))}
          eventName={event.title}
        />
      </main>

      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-screen-2xl mx-auto px-6 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {new Date(event.date).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
            {event.location && (
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
                {event.location}
              </div>
            )}
          </div>

          <Link
            href="/"
            className="text-gray-900 hover:text-gray-600 font-medium transition-colors"
          >
            EventShot
          </Link>
        </div>
      </footer>
    </div>
  );
}
