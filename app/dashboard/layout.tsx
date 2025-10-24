"use client";

import { DashboardNav } from "@/components/layout/DashboardNav";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Hook pour renouveler automatiquement le token
  useAuth();

  return (
    <>
      <DashboardNav />
      {children}
    </>
  );
}
