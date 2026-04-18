"use client";

import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  useRequireAuth();
  return <>{children}</>;
}