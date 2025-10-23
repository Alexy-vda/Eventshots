"use client";

import { useState } from "react";
import Image from "next/image";

interface Event {
  slug: string;
  title: string;
  date: string;
  cover: string;
  coverBlur: string;
}

export function EventList({ initialEvents }: { initialEvents: Event[] }) {
  const [query, setQuery] = useState("");

  const filtered = initialEvents.filter((e) =>
    e.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Rechercher un événement..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-6 w-full border px-4 py-2 rounded"
      />
      <div className="grid sm:grid-cols-2 gap-6">
        {filtered.map((e) => (
          <div
            key={e.slug}
            className="rounded-lg overflow-hidden shadow border"
          >
            <div className="relative h-56">
              <Image
                src={e.cover}
                alt={e.title}
                fill
                placeholder="blur"
                blurDataURL={e.coverBlur}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold">{e.title}</h3>
              <p className="text-sm opacity-75">{e.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
