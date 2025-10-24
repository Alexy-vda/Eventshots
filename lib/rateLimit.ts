// Utilitaire simple de rate limiting (in-memory)
// Pour la production, utiliser Redis ou un service externe comme Upstash

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Vérifier si une requête dépasse la limite de taux
 * @param identifier - Identifiant unique (IP, user ID, etc.)
 * @param maxRequests - Nombre maximum de requêtes
 * @param windowMs - Fenêtre de temps en millisecondes
 * @returns true si la limite est atteinte
 */
export function checkRateLimit(
  identifier: string,
  maxRequests = 100,
  windowMs = 60000 // 1 minute par défaut
): { limited: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // Si pas d'entrée ou si la fenêtre est expirée
  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs;
    rateLimitStore.set(identifier, { count: 1, resetAt });
    return { limited: false, remaining: maxRequests - 1, resetAt };
  }

  // Incrémenter le compteur
  entry.count++;
  rateLimitStore.set(identifier, entry);

  // Vérifier si la limite est atteinte
  if (entry.count > maxRequests) {
    return { limited: true, remaining: 0, resetAt: entry.resetAt };
  }

  return {
    limited: false,
    remaining: maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Nettoyer les entrées expirées (appeler périodiquement)
 */
export function cleanupRateLimit() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}

// Nettoyer toutes les 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(cleanupRateLimit, 5 * 60 * 1000);
}
