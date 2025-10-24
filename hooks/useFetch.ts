"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/authClient";

interface UseFetchOptions<T> {
  url: string;
  initialData?: T;
  skip?: boolean;
}

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useFetch<T>({
  url,
  initialData,
  skip = false,
}: UseFetchOptions<T>): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(initialData ?? null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (skip) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetchWithAuth(url);

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des données");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, skip]);

  return { data, loading, error, refetch: fetchData };
}
