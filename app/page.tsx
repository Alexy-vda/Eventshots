// app/page.tsx
import Image from "next/image";
import Link from "next/link";

export const revalidate = false;

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-zinc-900 to-zinc-800 text-white">
      <div className="max-w-2xl text-center p-6">
        <h1 className="text-4xl font-bold mb-4">EventShots Pro</h1>
        <p className="text-zinc-300 mb-8">
          Plateforme démo Next.js pour la gestion d’événements photo.
        </p>
        <Image
          src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14"
          alt="concert"
          width={600}
          height={400}
          className="rounded-xl shadow-lg mb-8"
          priority
        />
        <Link
          href="/events"
          className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-zinc-200 transition"
        >
          Explorer les événements
        </Link>
      </div>
    </main>
  );
}
