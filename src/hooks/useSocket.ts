import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { getSocket, setSocketToken, disconnectSocket } from "@/lib/sockets/socket";
import { useAppSelector } from "@/store/hooks";
import { authService } from "@/services/auth.service";

type SocketEvents = {
  onNotification?: (data: any) => void;
  onMessage?: (data: any) => void;
};

function tryGetSocket(): Socket | null {
  try { return getSocket(); } catch { return null; }
}

export function useSocket(events?: SocketEvents): Socket | null {
  const socketRef = useRef<Socket | null>(null);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const hasHydrated = useAppSelector((state) => state.auth.hasHydrated);

  useEffect(() => {
    if (!isAuthenticated || !hasHydrated) return;

    async function initSocket() {
      try {
        // After login: token already in memory, connect directly
        let socket = tryGetSocket();

        // After page reload: token wiped from memory, fetch a fresh one
        if (!socket) {
          const res = await authService.refreshToken();
          const token = res.data?.data?.user?.accessToken
                     ?? sessionStorage.getItem("_bzt");

          if (!token) return;

          setSocketToken(token);
          sessionStorage.setItem("_bzt", token);
          socket = tryGetSocket();
          if (!socket) return;
        }

        socketRef.current = socket;

        socket.on("connect", () => console.log("✅ Socket connected:", socket!.id));

        socket.on("connect_error", (err) => {
          console.error("❌ Socket error:", err.message);
          if (err.message === "Unauthorized") {
            sessionStorage.removeItem("_bzt");
          }
        });

        socket.on("disconnect", (reason) => console.warn("⚠️ Socket disconnected:", reason));

        if (events?.onNotification) socket.on("notification:receive", events.onNotification);
        if (events?.onMessage) socket.on("receive-message", events.onMessage);

      } catch (err) {
        console.warn("Socket init failed:", err);
      }
    }

    initSocket();

    return () => { disconnectSocket(); };
  }, [isAuthenticated, hasHydrated]);

  return socketRef.current;
}