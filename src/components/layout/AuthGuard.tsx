"use client";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useAppSelector } from "@/store/hooks";
import { usePathname } from "next/navigation";

const EXCLUDED_ROUTES = ["/home", "/feed", "/library", "/privacy", "/legal", "/privacy-policy", "/copyright", "/goplus", "/artist"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const hasHydrated = useAppSelector((state) => state.auth.hasHydrated);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const pathname = usePathname();

  useRequireAuth();

  const isExempt = EXCLUDED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (!hasHydrated) return null
  if (!isAuthenticated && !isExempt) return null

  return <>{children}</>;
}