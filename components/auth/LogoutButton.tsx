"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface LogoutButtonProps {
  className?: string;
  variant?: "default" | "dropdown";
}

export function LogoutButton({
  className = "",
  variant = "default",
}: LogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    try {
      const res = await fetch("/api/logout", { method: "POST" });
      if (!res.ok) throw new Error();
      localStorage.removeItem("access_token");
      localStorage.removeItem("username");
      localStorage.removeItem("token");

      // Émettre un événement pour notifier la Navbar
      window.dispatchEvent(new Event("auth-change"));
    } finally {
      setLoading(false);
      router.replace("/login");
      router.refresh();
    }
  }

  // Style dropdown : item de menu simple
  if (variant === "dropdown") {
    return (
      <button
        onClick={logout}
        disabled={loading}
        className={`w-full text-left px-4 py-2 text-sm text-terracotta hover:bg-terracotta/10 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        aria-label="Se déconnecter"
      >
        <span className="text-lg">🚪</span>
        <span>{loading ? "Déconnexion..." : "Se déconnecter"}</span>
      </button>
    );
  }

  // Style default : bouton normal
  return (
    <Button
      onClick={logout}
      variant="secondary"
      size="md"
      isLoading={loading}
      className={className}
      aria-label="Se déconnecter"
    >
      {loading ? "Déconnexion..." : "🚪 Déconnexion"}
    </Button>
  );
}
