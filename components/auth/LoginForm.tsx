"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@acme.io");
  const [password, setPassword] = useState("pass1234");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Cookies HttpOnly seront posés par la route.
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Identifiants incorrects");
      }

      // Stocker le token dans localStorage pour les client components
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("access_token", data.token);
        localStorage.setItem("username", email.split("@")[0]);

        // Émettre un événement pour notifier la Navbar
        window.dispatchEvent(new Event("auth-change"));
      }

      router.push("/dashboard");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erreur de connexion";
      setErr(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Input
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
        placeholder="votre@email.com"
      />

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-navy">
          Mot de passe
        </label>
        <div className="flex items-center gap-2">
          <input
            type={showPwd ? "text" : "password"}
            className="flex-1 px-4 py-2.5 border-2 border-sage/30 rounded-lg 
                     focus:ring-2 focus:ring-terracotta focus:border-terracotta 
                     bg-white text-navy placeholder:text-navy/40
                     transition-all hover:border-sage/50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            minLength={6}
            placeholder="Votre mot de passe"
          />
          <button
            type="button"
            onClick={() => setShowPwd((s) => !s)}
            className="px-3 py-2.5 text-lg border-2 border-sage/30 rounded-lg 
                     hover:bg-gold/20 hover:border-sage/50 transition-all"
            aria-label={showPwd ? "Masquer" : "Afficher"}
          >
            {showPwd ? "🙈" : "👁️"}
          </button>
        </div>
      </div>

      {!!err && (
        <div
          className="flex items-center space-x-3 text-sm text-terracotta 
                      bg-terracotta/10 border-2 border-terracotta/30 rounded-lg p-4"
        >
          <span className="text-xl">⚠️</span>
          <span className="font-medium">{err}</span>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        isLoading={loading}
      >
        {loading ? "Connexion en cours..." : "Se connecter"}
      </Button>
    </form>
  );
}
