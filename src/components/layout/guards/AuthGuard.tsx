"use client";

import { useRequireAuth } from "@/hooks/require-auth/useRequireAuth";
import { useAppSelector } from "@/store/hooks";
import { usePathname } from "next/navigation";
import { EXCLUDED_ROUTES, ADMIN_ROUTES } from "@/hooks/require-auth/routes";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const hasHydrated = useAppSelector((state) => state.auth.hasHydrated);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const role = useAppSelector((state) => state.auth.role);
  const pathname = usePathname();

  useRequireAuth();

  const isExempt = EXCLUDED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  const isAdminRoute = ADMIN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (!hasHydrated) return null
  if (!isAuthenticated && !isExempt) return null
  if (isAuthenticated && role !== "Admin" && isAdminRoute) return null
  if (isAuthenticated && role === "Admin" && !isAdminRoute) return null

  return <>{children}</>;
}