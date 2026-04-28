import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { getSocket, setSocketToken, disconnectSocket } from "@/lib/sockets/socket";
import { useAppSelector } from "@/store/hooks";
import { authService } from "@/services/auth.service";

type SocketEvents = {
  onNotification?: (data: any) => void;
  onMessage?:      (data: any) => void;
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
  const socketRef       = useRef<Socket | null>(null);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const hasHydrated     = useAppSelector((state) => state.auth.hasHydrated);

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
// Separate hook called inside Conversation — uses getSocket() with a retry
// because by the time Conversation mounts the socket is already initialized
// by useSocket in the layout.

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
    const MAX_RETRIES = 20  // 20 × 300ms = 6 seconds max wait

    const handler = (data: any) => {
      console.log("📨 message:send received:", data)
      callbackRef.current({
        _id:       data.lastMessage._id,
        chatId:    chatId,
        senderId:  data.lastMessage.senderId,
        content:   data.lastMessage.content,
        seenBy:    data.lastMessage.seenBy,
        createdAt: data.lastMessage.createdAt,
      })
    }

    const joinRoom = (s: Socket) => {
      console.log("🟢 Joining chat room:", chatId)
      s.emit("chat:join", { chatId })
      s.off("message:send")
      s.on("message:send", handler)
    }

    const tryJoin = () => {
      try {
        socket = getSocket()
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
        socket.off("message:send", handler)
      }
    }
  }, [chatId])
}