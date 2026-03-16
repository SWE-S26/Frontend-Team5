"use client"
import { useEffect } from "react"

export default function MSWProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return
    import("@/mocks/browser").then(({ worker }) => {
      worker.start({ onUnhandledRequest: "bypass" })
    })
  }, [])

  return <>{children}</>
}