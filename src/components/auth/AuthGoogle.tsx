"use client"

import { useEffect } from "react"
import { useAppDispatch } from "@/store/hooks"
import { setAuth, clearAuth, hydrateAuth } from "@/store/slices/authSlice"

export default function AuthGoogle() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    let active = true

    const syncGoogle = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || ""

      try {
        const res = await fetch(`${baseUrl}/api/auth/v1/refresh-token`, {
          method: "GET",
          credentials: "include",
        })

        if (!active) return

        if (res.ok) {
          const body = await res.json().catch(() => null)
          const user = body?.data?.user

          dispatch(
            setAuth({
              userId: user?.id || null,
              displayName: user?.displayName || null,
              profileImgLink: user?.profileImg?.imgLink || null,
              bannerImgLink: user?.bannerImg?.imgLink || null,
            })
          )
          return
        }

        if (res.status === 401 || res.status === 403) {
          dispatch(clearAuth())
        }
      } catch {
        // network error — still need to unblock the UI
      } finally {
        // always runs regardless of success, 401/403, or network error
        // without this, hasHydrated stays false and the navbar never renders
        if (active) dispatch(hydrateAuth({}))
      }
    }

    syncGoogle()

    return () => {
      active = false
    }
  }, [dispatch])

  return null
}