"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    <form
      onSubmit={onSubmit}
      className="space-y-4 border rounded-xl p-6 shadow-sm"
    >
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Nom complet
        </label>
        <input
          id="name"
          type="text"
          className="w-full rounded-md border px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          placeholder="John Doe"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="w-full rounded-md border px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          placeholder="john@example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Mot de passe
        </label>
        <div className="flex items-center gap-2">
          <input
            id="password"
            type={showPwd ? "text" : "password"}
            className="w-full rounded-md border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
            minLength={6}
            placeholder="••••••"
          />
          <button
            type="button"
            onClick={() => setShowPwd((s) => !s)}
            className="text-sm px-2 py-1 border rounded-md"
            aria-label={showPwd ? "Masquer" : "Afficher"}
          >
            {showPwd ? "🙈" : "👁️"}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium">
          Confirmer le mot de passe
        </label>
        <input
          id="confirmPassword"
          type={showPwd ? "text" : "password"}
          className="w-full rounded-md border px-3 py-2"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          required
          minLength={6}
          placeholder="••••••"
        />
      </div>

      {!!err && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded p-2">
          {err}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-black text-white py-2 font-medium disabled:opacity-50"
      >
        {loading ? "Inscription..." : "S'inscrire"}
      </button>

      <p className="text-center text-sm text-zinc-600">
        Déjà un compte ?{" "}
        <Link href="/login" className="text-black font-medium hover:underline">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
