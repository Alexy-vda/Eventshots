// app/events/page.tsx
import { fetchEvents } from "@/lib/api";
import { EventList } from "@/components/EventList";

export const revalidate = 60;

export default async function EventsPage() {
  const events = await fetchEvents({ tag: "events" });
  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Événements</h1>
      <EventList initialEvents={events} />
    </main>
  );
}
