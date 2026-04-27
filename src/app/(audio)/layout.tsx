"use client"
import AuthGuard from "@/components/layout/AuthGuard";
import NotificationToast from "@/components/notifications/NotificationToast";
import { useSocket } from "@/hooks/useSocket";
import { toastBus } from "@/lib/sockets/toastBus";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  useSocket({
    onNotification: (data) => {
      toastBus.emit(data);
    },
    onMessage: (data) => {
      console.log("💬 message received:", data);
    },
  });
  return <AuthGuard>{children}<NotificationToast /></AuthGuard>;
}