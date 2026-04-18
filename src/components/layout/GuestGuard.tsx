"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

export default function GuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const hasHydrated = useAppSelector((state) => state.auth.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;
    if (isAuthenticated) router.replace("/home");
  }, [hasHydrated, isAuthenticated, router]);

  if (!hasHydrated) return null;
  if (isAuthenticated) return null;

  return <>{children}</>;
}