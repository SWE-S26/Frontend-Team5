import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let storedToken: string | null = null;

export function setSocketToken(token: string) {
  storedToken = token;
}

// Only called by useSocket — the single place responsible for creating the socket
export function createSocket(): Socket {
  if (!storedToken) throw new Error("No token available for socket");

  if (socket) {
    socket.disconnect();
    socket = null;
  }

  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
    query: { token: storedToken },
    transports: ["websocket"],
    autoConnect: true,
  });

  return socket;
}

// Returns existing socket — throws if not yet initialized
// Never creates a new socket — that is createSocket()'s job
export function getSocket(): Socket {
  if (!socket) throw new Error("Socket not initialized");
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}