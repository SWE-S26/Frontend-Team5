"use client"
import { useEffect, useState } from "react"

export default function MSWProvider({ children }: { children: React.ReactNode }) {
  const useMSW = process.env.NEXT_PUBLIC_USE_MSW === "true"
  const [mswReady, setMswReady] = useState(!useMSW) // ← true immediately if MSW disabled

  useEffect(() => {
    if (!useMSW) return

    import("@/mocks/browser").then(({ worker }) => {
      worker.start({ onUnhandledRequest: "bypass" }).then(() => {
        setMswReady(true)
      })
    })
  }, [])

  if (!mswReady) return null

  return <>{children}</>
}