import { cookies } from "next/headers";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Event {
  id: string;
  slug: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  shareLink: string;
  createdAt: string;
  _count?: {
    photos: number;
  };
  photos?: {
    url: string;
  }[];
}

export default async function Dashboard() {
  const token = (await cookies()).get("access_token")?.value;

  let events: Event[] = [];
  let error = null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events`, {
      cache: "no-store",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (res.ok) {
      const data = await res.json();
      events = data.events || [];
    } else {
      error = "Impossible de charger les événements";
    }
  } catch (err) {
    console.error("Error fetching events:", err);
    error = "Erreur de connexion";
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">
            Tableau de bord
          </h1>
          <p className="text-[#666]">
            Gérez vos événements et partagez vos photos
          </p>
        </div>

        {/* Actions */}
        <div className="mb-8">
          <Link
            href="/dashboard/events/new"
            className="inline-flex items-center px-4 py-2 bg-[#6366f1] text-white rounded-md font-medium hover:bg-[#4f46e5] transition-colors"
          >
            Créer un événement
          </Link>
        </div>

        {/* Events List */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">
            Mes événements
          </h2>

          {error && (
            <div className="bg-[#fef2f2] text-[#ef4444] px-4 py-3 rounded-md mb-4">
              {error}
            </div>
          )}

          {!error && events.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">
                Aucun événement
              </h3>
              <p className="text-[#666] mb-6">
                Créez votre premier événement pour commencer à partager vos
                photos
              </p>
              <Link
                href="/dashboard/events/new"
                className="inline-block px-4 py-2 bg-[#6366f1] text-white rounded-md font-medium hover:bg-[#4f46e5] transition-colors"
              >
                Créer un événement
              </Link>
            </div>
          )}

          {events.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((event) => {
                const coverImage = event.photos?.[0]?.url;
                const photoCount = event._count?.photos || 0;

                // Determine gradient colors based on event title hash for consistency
                const gradients = [
                  "from-[#6366f1] to-[#8b5cf6]",
                  "from-[#ec4899] to-[#f43f5e]",
                  "from-[#f59e0b] to-[#eab308]",
                  "from-[#10b981] to-[#14b8a6]",
                  "from-[#8b5cf6] to-[#ec4899]",
                ];
                const gradientIndex = event.id.charCodeAt(0) % gradients.length;
                const gradient = gradients[gradientIndex];

                return (
                  <Link
                    key={event.id}
                    href={`/dashboard/events/${event.id}`}
                    className="block bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                  >
                    {/* Cover Image or Placeholder */}
                    <div
                      className={`relative h-48 bg-gradient-to-br ${gradient}`}
                    >
                      {coverImage ? (
                        <>
                          <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${coverImage})` }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg
                            className="w-16 h-16 text-white/40"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                      )}

                      {/* Photo count badge */}
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm text-white rounded-md text-xs font-medium">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {photoCount}
                        </span>
                      </div>
                    </div>

                    {/* Event Info */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2 line-clamp-1">
                        {event.title}
                      </h3>
                      {event.description && (
                        <p className="text-[#666] mb-3 text-sm line-clamp-2">
                          {event.description}
                        </p>
                      )}
                      <div className="flex flex-col gap-1 text-xs text-[#999]">
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-3 h-3"
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
                          <span>
                            {new Date(event.date).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <svg
                              className="w-3 h-3"
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
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <span className="line-clamp-1">
                              {event.location}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
