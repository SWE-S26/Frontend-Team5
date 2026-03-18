"use client"
import { useEffect, useState } from "react"

export default function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(false)

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_USE_MSW === "true") {
      import("@/mocks/browser").then(({ worker }) => {
        worker.start({ onUnhandledRequest: "bypass" }).then(() => {
          setMswReady(true)
        })
      })
    } else {
      setMswReady(true)
    }
  }, [])

  if (!mswReady) return null

  return <>{children}</>
}