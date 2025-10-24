"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);

    // Validation côté client
    if (password !== confirmPassword) {
      setErr("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setErr("Le mot de passe doit contenir au moins 6 caractères");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Inscription échouée");
      }

      // Inscription réussie, rediriger vers login
      router.push("/login?registered=true");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erreur d'inscription";
      setErr(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        id="name"
        type="text"
        label="Nom complet"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="name"
        placeholder="John Doe"
        required
      />

      <Input
        id="email"
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        placeholder="john@example.com"
        required
      />

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Mot de passe
        </label>
        <div className="flex items-center gap-2">
          <input
            id="password"
            type={showPwd ? "text" : "password"}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
            minLength={6}
            placeholder="Minimum 6 caractères"
          />
          <button
            type="button"
            onClick={() => setShowPwd((s) => !s)}
            className="px-3 py-2 text-lg border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label={showPwd ? "Masquer" : "Afficher"}
          >
            {showPwd ? "🙈" : "👁️"}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Confirmer le mot de passe
        </label>
        <input
          id="confirmPassword"
          type={showPwd ? "text" : "password"}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          required
          minLength={6}
          placeholder="Confirmez votre mot de passe"
        />
      </div>

      {!!err && (
        <div className="flex items-center space-x-2 text-sm text-terracotta bg-terracotta/10 border border-terracotta/30 rounded-lg p-3">
          <span className="text-xl">⚠️</span>
          <span>{err}</span>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        isLoading={loading}
      >
        {loading ? "Inscription en cours..." : "Créer mon compte"}
      </Button>
    </form>
  );
}
