"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export default function AuthGoogle() {
  const { setAuthenticated } = useAuthStore();

  useEffect(() => {
    let active = true;

    const syncGoogle = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

      try {
        const res = await fetch(`${baseUrl}/api/auth/v1/refresh-token`, {
          method: "GET",
          credentials: "include",
        });

        if (!active) return;

        if (res.ok) {
          setAuthenticated(true);
          return;
        }

        if (res.status === 401 || res.status === 403) {
          setAuthenticated(false);
        }
      } catch {
      }
    };
    syncGoogle();
    return () => {
      active = false;
    };
  }, [setAuthenticated]);

  return null;
}
