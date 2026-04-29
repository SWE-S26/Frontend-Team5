import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { createSocket, getSocket, setSocketToken, disconnectSocket } from "@/lib/sockets/socket";
import { useAppSelector } from "@/store/hooks";
import { authService } from "@/services/auth.service";

type SocketEvents = {
  onNotification?: (data: any) => void;
  onMessage?:      (data: any) => void;
};

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
  const socketRef       = useRef<Socket | null>(null);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const hasHydrated     = useAppSelector((state) => state.auth.hasHydrated);

  useEffect(() => {
    if (!isAuthenticated || !hasHydrated) return;

    async function initSocket() {
      try {
        // Try to reuse existing socket first
        let socket: Socket | null = null
        try {
          socket = getSocket()
        } catch {
          // Socket not initialized yet — get a fresh token and create it
          const token = await getFreshToken();
          if (!token) return;
          socket = createSocket(); // ← only place that creates the socket
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
            const newSocket = createSocket(); // ← recreate on auth failure
            socketRef.current = newSocket;
            if (events?.onNotification) newSocket.on("notification:receive", events.onNotification);
            if (events?.onMessage)      newSocket.on("message:notify",       events.onMessage);
          }
        });

        socket.on("disconnect", (reason) => console.warn("⚠️ Socket disconnected:", reason));

        socket.on("error", (err: { message: string }) => {
          console.error("🔴 Socket operation error:", err.message);
        });

        if (events?.onNotification) socket.on("notification:receive", events.onNotification);
        if (events?.onMessage)      socket.on("message:notify",       events.onMessage);

      } catch (err) {
        console.warn("Socket init failed:", err);
      }
    }

    initSocket();

    return () => { disconnectSocket(); };
  }, [isAuthenticated, hasHydrated]);

  return socketRef.current;
}

// ─── useChatRoom ───────────────────────────────────────────────────────────────
// Uses getSocket() which NEVER creates a new socket — safe to call from anywhere
// The global listeners set up by useSocket are never affected

export function useChatRoom(
  chatId: string | null,
  onIncomingMessage: (raw: {
    _id: string; chatId: string; senderId: string
    content: string; seenBy: string[]; createdAt: string
  }) => void
) {
  const callbackRef = useRef(onIncomingMessage)
  useEffect(() => { callbackRef.current = onIncomingMessage }, [onIncomingMessage])

  useEffect(() => {
    if (!chatId) return

    let socket: Socket | null = null
    let retries = 0
    const MAX_RETRIES = 20

    const handler = (data: any) => {
      callbackRef.current({
        _id:       data.lastMessage._id,
        chatId:    chatId,
        senderId:  data.lastMessage.senderId,
        content:   data.lastMessage.content,
        seenBy:    data.lastMessage.seenBy,
        createdAt: data.lastMessage.createdAt,
      })
    }

    const notifyFallback = (data: any) => {
      const incomingChatId = data._id ?? data.chat
      if (incomingChatId === chatId) {
        handler(data)
      }
    }

    const joinRoom = (s: Socket) => {
      console.log("🟢 Joining chat room:", chatId)
      s.emit("chat:join", { chatId })
      s.off("message:send")
      s.on("message:send", (data: any) => {
        console.log("📨 message:send received:", data)
        handler(data)
      })
      // Named fallback — socket.off(event, fn) only removes this specific function
      // leaving the global message:notify listener from useSocket intact
      s.on("message:notify", notifyFallback)
    }

    const tryJoin = () => {
      try {
        socket = getSocket() // safe — never creates a new socket
      } catch {
        if (retries < MAX_RETRIES) {
          retries++
          setTimeout(tryJoin, 300)
        }
        return
      }

      if (socket.connected) {
        joinRoom(socket)
      } else {
        socket.once("connect", () => joinRoom(socket!))
      }
    }

    tryJoin()

    return () => {
      if (socket) {
        console.log("🔴 Leaving chat room:", chatId)
        socket.emit("chat:leave", { chatId })
        socket.off("message:send")
        socket.off("message:notify", notifyFallback) // only removes notifyFallback
      }
    }
  }, [chatId])
}