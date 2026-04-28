"use client"

import { createContext, useContext, useRef, ReactNode } from "react"
import { Socket } from "socket.io-client"

const SocketContext = createContext<{ socketRef: React.MutableRefObject<Socket | null> } | null>(null)

export function SocketProvider({ children }: { children: ReactNode }) {
  const socketRef = useRef<Socket | null>(null)
  return (
    <SocketContext.Provider value={{ socketRef }}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocketContext() {
  const ctx = useContext(SocketContext)
  if (!ctx) throw new Error("useSocketContext must be used inside SocketProvider")
  return ctx
}
