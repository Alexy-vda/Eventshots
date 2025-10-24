"use client";

import Link from "next/link";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { useSyncExternalStore, useState, useEffect, useRef } from "react";

/**
 * Navigation optimisée pour le dashboard
 * - Dropdown pour profil utilisateur
 * - Logo cliquable vers landing
 * - Minimal et performant
 * - useSyncExternalStore pour hydration-safe localStorage
 */
export function DashboardNav() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Hook React 18+ pour synchroniser avec localStorage (hydration-safe)
  const username = useSyncExternalStore(
    // subscribe: appelé côté client uniquement
    () => {
      // Pas besoin d'écouter les changements (statique après login)
      return () => {};
    },
    // getSnapshot: valeur côté client
    () => {
      if (typeof window === "undefined") return "";
      return localStorage.getItem("username") || "";
    },
    // getServerSnapshot: valeur côté serveur (toujours vide)
    () => ""
  );

  // Fermer le dropdown si clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <nav className="bg-white/95 border-b-2 border-sage/20 sticky top-0 z-40 backdrop-blur-lg shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo - Retour à l'accueil */}
          <Link
            href="/"
            className="flex items-center space-x-1 sm:space-x-2 text-lg sm:text-2xl font-bold font-serif text-navy hover:text-terracotta hover:scale-105 transition-all shrink-0"
            aria-label="Retour à l'accueil EventShot"
          >
            <span>📸</span>
            <span className="hidden xs:inline">EventShot</span>
          </Link>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            {/* Dropdown Trigger */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 
                       bg-gold/10 hover:bg-gold/20 border-2 border-sage/20
                       rounded-lg transition-all 
                       focus:outline-none focus:ring-2 focus:ring-terracotta/50 focus:border-terracotta"
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
              <span className="text-xl sm:text-2xl" aria-hidden="true">
                👤
              </span>
              <span className="font-semibold text-navy text-xs sm:text-sm truncate max-w-20 sm:max-w-32">
                {username || "Utilisateur"}
              </span>
              {/* Icône flèche */}
              <svg
                className={`w-4 h-4 text-sage transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border-2 border-sage/30 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* User Info */}
                <div className="px-4 py-3 border-b-2 border-gold/30">
                  <p className="text-sm font-bold text-navy truncate">
                    {username || "Utilisateur"}
                  </p>
                  <p className="text-xs text-sage font-medium mt-1">
                    Compte photographe
                  </p>
                </div>

                {/* Logout Button */}
                <div className="py-1">
                  <LogoutButton variant="dropdown" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
