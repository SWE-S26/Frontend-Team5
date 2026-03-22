"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export default function AuthGoogle() {
  const { setAuthenticated, setUserId, setDisplayName, setProfileImg } = useAuthStore();

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
          const body = await res.json().catch(() => null);
          const user = body?.data?.user;
          if (user?.id) setUserId(user.id);
          setDisplayName(user?.displayName || null);
          setProfileImg(user?.profileImg?.imgLink || null);
          setAuthenticated(true);
          return;
        }

        if (res.status === 401 || res.status === 403) {
          setAuthenticated(false);
          setUserId(null);
          setDisplayName(null);
          setProfileImg(null);
        }
      } catch {
      }
    };
    syncGoogle();
    return () => {
      active = false;
    };
  }, [setAuthenticated, setUserId, setDisplayName, setProfileImg]);

  return null;
}
