export async function fetchEvents({ tag }: { tag?: string } = {}) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events`, {
    next: tag ? { tags: [tag] } : {},
  });
  if (!res.ok) throw new Error("Failed to load events");
  return res.json();
}
