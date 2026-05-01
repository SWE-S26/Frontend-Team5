"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hasHydrated = useAppSelector((state) => state.auth.hasHydrated);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const role = useAppSelector((state) => state.auth.role);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated) router.replace("/");
    if (isAuthenticated && role !== "Admin") router.replace("/home");
  }, [hasHydrated, isAuthenticated, role, router]);

  if (!hasHydrated) return null;
  if (!isAuthenticated) return null;
  if (role !== "Admin") return null;

  return <>{children}</>;
}