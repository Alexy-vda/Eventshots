"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Nom complet
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          placeholder="John Doe"
          required
          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg 
                   focus:outline-none focus:border-[#6366f1] 
                   text-[#1a1a1a] placeholder:text-gray-400
                   transition-colors"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          placeholder="john@example.com"
          required
          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg 
                   focus:outline-none focus:border-[#6366f1] 
                   text-[#1a1a1a] placeholder:text-gray-400
                   transition-colors"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Mot de passe
        </label>
        <input
          id="password"
          type={showPwd ? "text" : "password"}
          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg 
                   focus:outline-none focus:border-[#6366f1] 
                   text-[#1a1a1a] placeholder:text-gray-400
                   transition-colors"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
          minLength={6}
          placeholder="Minimum 6 caractères"
        />
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
          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg 
                   focus:outline-none focus:border-[#6366f1] 
                   text-[#1a1a1a] placeholder:text-gray-400
                   transition-colors"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          required
          minLength={6}
          placeholder="Confirmez votre mot de passe"
        />
        <button
          type="button"
          onClick={() => setShowPwd((s) => !s)}
          className="text-sm text-[#6366f1] hover:text-[#4f46e5] font-medium transition-colors"
        >
          {showPwd ? "Masquer les mots de passe" : "Afficher les mots de passe"}
        </button>
      </div>

      {!!err && (
        <div className="bg-[#fef2f2] border border-[#ef4444]/20 text-[#ef4444] px-4 py-3 rounded-lg text-sm">
          <span className="font-medium">{err}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-3 bg-[#6366f1] text-white rounded-lg font-medium 
                 hover:bg-[#4f46e5] 
                 disabled:bg-gray-300 disabled:cursor-not-allowed
                 transition-colors"
      >
        {loading ? "Création du compte..." : "Créer mon compte"}
      </button>
    </form>
  );
}
