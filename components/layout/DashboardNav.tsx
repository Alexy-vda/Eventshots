"use client";

import Link from "next/link";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { useSyncExternalStore, useState, useEffect, useRef } from "react";

export function DashboardNav() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const username = useSyncExternalStore(
    () => {
      return () => {};
    },

    () => {
      if (typeof window === "undefined") return "";
      return localStorage.getItem("username") || "";
    },

    () => ""
  );

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
    <nav className="bg-white border-b border-[#f0f0f0] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="flex items-center space-x-2 text-xl font-bold text-[#1a1a1a] hover:text-[#6366f1] transition-colors"
            aria-label="Retour à l'accueil EventShot"
          >
            <span className="hidden sm:inline">EventShot</span>
            <span className="sm:hidden">ES</span>
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-2 
                       bg-[#fafafa] hover:bg-[#f0f0f0] rounded-md transition-colors 
                       focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
              <span className="w-8 h-8 bg-[#e0e7ff] rounded-full flex items-center justify-center text-[#6366f1] font-semibold text-sm">
                {username ? username.charAt(0).toUpperCase() : "U"}
              </span>
              <span className="font-medium text-[#1a1a1a] text-sm hidden sm:block max-w-32 truncate">
                {username || "Utilisateur"}
              </span>

              <svg
                className={`w-4 h-4 text-[#666] transition-transform ${
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

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg border border-[#f0f0f0] py-1 z-50 shadow-lg">
                <div className="px-4 py-3 border-b border-[#f0f0f0]">
                  <p className="text-sm font-semibold text-[#1a1a1a] truncate">
                    {username || "Utilisateur"}
                  </p>
                  <p className="text-xs text-[#666] font-medium mt-1">
                    Compte photographe
                  </p>
                </div>

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
