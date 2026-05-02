"use client";

import LoginForm from "@/components/auth/LoginForm";
import { useAppSelector } from "@/store/hooks";

export default function LibraryGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const hasHydrated = useAppSelector((state) => state.auth.hasHydrated);

  if (!hasHydrated) return null;

  if (!isAuthenticated) {
    return (
      <div className="mb-5 px-2 sm:px-0">
        <h2 className="text-white-smoke text-xl font-bold text-center mt-3">
            Join SoundCloud to save your favorite tracks, playlists and albums
        </h2>
        <div className="flex flex-col items-center justify-center mt-4 gap-6 w-full max-w-110 mx-auto border border-white-smoke p-5">
            <LoginForm />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}