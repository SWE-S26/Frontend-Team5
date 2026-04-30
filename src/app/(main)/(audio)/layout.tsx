"use client";
import AuthGuard from "@/components/layout/AuthGuard";
import NotificationToast from "@/components/notifications/NotificationToast";
import { NotificationsProvider } from "@/components/notifications/NotificationsContext";
import { useNotificationsContext } from "@/components/notifications/NotificationsContext";
import { useSocket } from "@/hooks/sockets/useSocket";
import { toastBus } from "@/lib/toasts/toastBus";

function SocketInitializer() {
  const { incrementUnread, addIncoming } = useNotificationsContext();

  useSocket({
    onNotification: (data) => {
      toastBus.emit(data);
      incrementUnread();
      addIncoming(data);
    },
    onMessage: (data) => {
      console.log("💬 message received:", data);
    },
  });

  return null;
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationsProvider>
      <SocketInitializer />
      <AuthGuard>
        {children}
        <NotificationToast />
      </AuthGuard>
    </NotificationsProvider>
  );
}
