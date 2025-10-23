"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <form
      onSubmit={onSubmit}
      className="space-y-4 border rounded-xl p-6 shadow-sm"
    >
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <input
          type="email"
          className="w-full rounded-md border px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Mot de passe</label>
        <div className="flex items-center gap-2">
          <input
            type={showPwd ? "text" : "password"}
            className="w-full rounded-md border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            minLength={6}
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
        {loading ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}
