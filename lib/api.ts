const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export async function fetchEvents({ tag }: { tag?: string } = {}) {
  const res = await fetch(`${getBaseUrl()}/api/events`, {
    next: tag ? { tags: [tag] } : {},
  });
  if (!res.ok) throw new Error("Failed to load events");
  return res.json();
}
