"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { refreshAccessToken } from "@/lib/authClient";

export function useAuth() {
  const router = useRouter();

  useEffect(() => {

    const interval = setInterval(async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        const refreshed = await refreshAccessToken();
        if (!refreshed) {

          localStorage.removeItem("access_token");
          localStorage.removeItem("username");
          router.push("/login");
        }
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [router]);
}
