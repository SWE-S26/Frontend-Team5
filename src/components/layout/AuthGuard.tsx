"use client";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useAppSelector } from "@/store/hooks";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const hasHydrated = useAppSelector((state) => state.auth.hasHydrated);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  
  useRequireAuth();

  if (!hasHydrated) return null
  if (!isAuthenticated) return null

  return <>{children}</>;
}