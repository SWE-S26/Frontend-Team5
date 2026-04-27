import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let storedToken: string | null = null;

export function setSocketToken(token: string) {
  storedToken = token;
}

export function getSocket(): Socket {
  if (socket?.connected) return socket;
  if (!storedToken) throw new Error("No token available for socket");

  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
    query: { token: storedToken },
    transports: ["websocket"],
    autoConnect: true,
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}