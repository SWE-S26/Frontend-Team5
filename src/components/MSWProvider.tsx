"use client"
import { useEffect, useState } from "react"

export default function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(false)

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      setMswReady(true)
      return
    }

    import("@/mocks/browser").then(({ worker }) => {
      worker.start({ onUnhandledRequest: "bypass" }).then(() => {
        setMswReady(true) // ← only show children AFTER MSW is ready
      })
    })
  }, [])

  if (!mswReady) return null // ← wait, don't render anything yet

  return <>{children}</>
}