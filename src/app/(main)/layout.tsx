"use client";
import AuthGuard from "@/components/layout/AuthGuard";
import Navbar from "@/components/layout/navbar/main-navbar/Navbar";
import PlayerBar from "@/components/layout/player/PlayerBar";
import NotificationToast from "@/components/notifications/NotificationToast";
import { useSocket } from "@/hooks/useSocket";
import { toastBus } from "@/lib/sockets/toastBus";

export default function MainLayout({ children }: { children: React.ReactNode }) {

  useSocket({
    onNotification: (data) => {
      toastBus.emit(data);
    },
    onMessage: (data) => {
      console.log("💬 message received:", data);
    },
  });

  return (
    <div>
      <AuthGuard>
        <Navbar className="fixed top-0 w-full z-1000 bg-chinese-black" />
        <main className="sm:mt-18 flex justify-center md:mb-11.75 pb-32 md:pb-0 pt-14 md:pt-0 overflow-x-hidden md:overflow-x-visible">
          <div className="w-full max-w-302">{children}</div>
        </main>
        <PlayerBar />
        <NotificationToast />
      </AuthGuard>
    </div>
  );
}