"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@acme.io");
  const [password, setPassword] = useState("pass1234");
  const [showPwd, setShowPwd] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Identifiants incorrects");
      }

      const data = await res.json();
      if (data.token) {
        localStorage.setItem("access_token", data.token);
        localStorage.setItem("username", email.split("@")[0]);
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
          required
          placeholder="alex.jordan@gmail.com"
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
          Password
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
          autoComplete="current-password"
          required
          minLength={6}
          placeholder="••••••••••"
        />
        <button
          type="button"
          onClick={() => setShowPwd((s) => !s)}
          className="text-sm text-[#6366f1] hover:text-[#4f46e5] font-medium transition-colors"
        >
          {showPwd ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        </button>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="sr-only peer"
            />
            <div
              className="w-11 h-6 bg-gray-200 rounded-full peer 
                          peer-checked:bg-[#6366f1] 
                          transition-colors duration-200"
            ></div>
            <div
              className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full 
                          transition-transform duration-200
                          peer-checked:translate-x-5"
            ></div>
          </div>
          <span className="text-sm text-gray-700">
            Remember sign in details
          </span>
        </label>
        <button
          type="button"
          className="text-sm text-[#6366f1] hover:text-[#4f46e5] font-medium transition-colors"
        >
          Forgot password?
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
        {loading ? "Connexion en cours..." : "Log in"}
      </button>
    </form>
  );
}
