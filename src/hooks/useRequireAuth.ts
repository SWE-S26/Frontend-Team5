import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

const EXECLUDED_ROUTES = ["/home", "/feed", "/library", "/privacy", "/legal", "/privacy-policy", "/copyright", "/goplus", "/artist"];

export function useRequireAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const hasHydrated = useAppSelector((state) => state.auth.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;
    const isExempt = EXECLUDED_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );
    if (!isAuthenticated && !isExempt) router.replace("/sign-in");
  }, [hasHydrated, isAuthenticated, pathname, router]);
}