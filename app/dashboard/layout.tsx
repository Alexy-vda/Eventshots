"use client";

import { DashboardNav } from "@/components/layout/DashboardNav";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  useAuth();

  return (
    <>
      <DashboardNav />
      {children}
    </>
  );
}
