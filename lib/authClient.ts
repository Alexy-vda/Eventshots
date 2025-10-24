// lib/authClient.ts
// Utilities pour l'authentification côté client
// Note: Ce fichier est utilisé uniquement côté client (pas de "use client" nécessaire dans un fichier lib)

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

export async function refreshAccessToken(): Promise<boolean> {
  // Si un refresh est déjà en cours, attendre qu'il se termine
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const res = await fetch("/api/refresh", {
        method: "POST",
        credentials: "include", // Important pour envoyer les cookies
      });

      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          localStorage.setItem("access_token", data.token);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Refresh token failed:", error);
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem("access_token");

  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let response = await fetch(url, { ...options, headers });

  // Si 401 (token expiré), essayer de refresh
  if (response.status === 401) {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      // Réessayer la requête avec le nouveau token
      const newToken = localStorage.getItem("access_token");
      const newHeaders = {
        ...options.headers,
        ...(newToken ? { Authorization: `Bearer ${newToken}` } : {}),
      };
      response = await fetch(url, { ...options, headers: newHeaders });
    } else {
      // Refresh échoué, rediriger vers login
      localStorage.removeItem("access_token");
      localStorage.removeItem("username");
      window.location.href = "/login";
    }
  }

  return response;
}
