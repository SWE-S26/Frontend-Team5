"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

const EXEMPT_ROUTES = ["/cross-callback"];

export default function GuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const hasHydrated = useAppSelector((state) => state.auth.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;
    const isExempt = EXEMPT_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );
    if (isAuthenticated && !isExempt) router.replace("/home");
  }, [hasHydrated, isAuthenticated, pathname, router]);

  if (!hasHydrated) return null;

  const isExempt = EXEMPT_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isAuthenticated && !isExempt) return null;

  return <>{children}</>;
}