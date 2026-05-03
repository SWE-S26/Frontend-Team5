import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { EXCLUDED_ROUTES, ADMIN_ROUTES } from "@/hooks/require-auth/routes";

export function useRequireAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const hasHydrated = useAppSelector((state) => state.auth.hasHydrated);
  const role = useAppSelector((state) => state.auth.role);

  useEffect(() => {
    if (!hasHydrated) return;

    const isAdminRoute = ADMIN_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );

    const isExempt = EXCLUDED_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );

    // Non-authenticated user trying to access protected route
    if (!isAuthenticated && !isExempt) {
      router.replace("/sign-in");
      return;
    }

    // Admin trying to access non-admin routes
    if (isAuthenticated && role === "Admin" && !isAdminRoute) {
      router.replace("/admin-dash/profiles-manage");
      return;
    }

    // Non-admin trying to access admin routes
    if (isAuthenticated && role !== "Admin" && isAdminRoute) {
      router.replace("/home");
      return;
    }
  }, [hasHydrated, isAuthenticated, pathname, router, role]);
}
