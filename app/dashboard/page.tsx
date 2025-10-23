import { LogoutButton } from "@/components/auth/LogoutButton";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

interface Event {
  slug: string;
  title: string;
  date: string;
}

export default async function Dashboard() {
  const token = (await cookies()).get("access_token")?.value;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events`, {
    cache: "no-store",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const events = await res.json();

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Bienvenue Alexy 👋</h1>
      <p className="text-zinc-600 mb-8">Voici quelques événements à venir :</p>
      <ul className="grid gap-4">
        {events.slice(0, 3).map((e: Event) => (
          <li key={e.slug} className="border rounded p-4 hover:bg-zinc-50">
            <b>{e.title}</b> <span className="text-sm">({e.date})</span>
          </li>
        ))}
      </ul>
      <LogoutButton className="mt-8" />
    </main>
  );
}
