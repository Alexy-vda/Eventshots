import { NextResponse } from "next/server";

// fake DB in-memory (ou remplace par un fetch externe)
const EVENTS = [
  {
    slug: "samflash-chorus",
    title: "Samflash @ Chorus",
    date: "2025-12-12T21:00:00Z",
    cover: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14",
    coverBlur: "data:image/jpeg;base64,/9j/4AAQSk...",
  },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  const body = slug ? EVENTS.find((e) => e.slug === slug) : EVENTS;
  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
