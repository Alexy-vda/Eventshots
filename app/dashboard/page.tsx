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
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Tableau de bord
          </h1>
          <p className="text-gray-600">
            Gérez vos événements et partagez vos photos
          </p>
        </div>

        {/* Actions */}
        <div className="mb-8">
          <Link
            href="/dashboard/events/new"
            className="inline-flex items-center px-6 py-3 bg-terracotta text-white rounded-lg font-semibold hover:bg-terracotta/90 hover:shadow-lg transition-all hover:scale-[1.02]"
          >
            <span className="text-xl mr-2">➕</span>
            Créer un événement
          </Link>
        </div>

        {/* Events List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Mes événements
          </h2>

          {error && (
            <div className="bg-terracotta/10 border border-terracotta/30 text-terracotta px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {!error && events.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📸</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Aucun événement
              </h3>
              <p className="text-gray-500 mb-6">
                Créez votre premier événement pour commencer à partager vos
                photos
              </p>
              <Link
                href="/dashboard/events/new"
                className="inline-block px-6 py-3 bg-terracotta text-white rounded-lg font-medium hover:bg-terracotta/90 transition-colors"
              >
                Créer un événement
              </Link>
            </div>
          )}

          {events.length > 0 && (
            <div className="grid gap-4">
              {events.map((event) => (
                <Link
                  key={event.id}
                  href={`/dashboard/events/${event.id}`}
                  className="block border border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {event.title}
                      </h3>
                      {event.description && (
                        <p className="text-gray-600 mb-3">
                          {event.description}
                        </p>
                      )}
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>
                          📅{" "}
                          {new Date(event.date).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        {event.location && <span>📍 {event.location}</span>}
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className="inline-block px-3 py-1 bg-terracotta/10 text-terracotta rounded-full text-sm font-medium">
                        {event._count?.photos || 0} photo
                        {(event._count?.photos || 0) !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
