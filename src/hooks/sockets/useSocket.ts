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

async function getFreshToken(): Promise<string | null> {
  try {
    const res = await authService.refreshToken();
    const token = res.data?.data?.accessToken;
    if (token) {
      sessionStorage.setItem("_bzt", token);
      setSocketToken(token);
    }
    return token ?? null;
  } catch {
    return null;
  }
}

export function useSocket(events?: SocketEvents): Socket | null {
  const socketRef = useRef<Socket | null>(null);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const hasHydrated = useAppSelector((state) => state.auth.hasHydrated);

  useEffect(() => {
    if (!isAuthenticated || !hasHydrated) return;

    async function initSocket() {
      try {
        let socket = tryGetSocket();

        if (!socket) {
          const token = await getFreshToken();
          if (!token) return;
          socket = tryGetSocket();
          if (!socket) return;
        }

        socketRef.current = socket;

        socket.on("connect", () => console.log("✅ Socket connected:", socket!.id));

        socket.on("connect_error", async (err) => {
          console.error("❌ Socket error:", err.message);
          if (err.message === "Unauthorized") {
            sessionStorage.removeItem("_bzt");
            disconnectSocket();
            const token = await getFreshToken();
            if (!token) return;
            const newSocket = tryGetSocket();
            if (!newSocket) return;
            socketRef.current = newSocket;
            if (events?.onNotification) newSocket.on("notification:receive", events.onNotification);
            if (events?.onMessage) newSocket.on("receive-message", events.onMessage);
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