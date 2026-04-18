"use client"

import { useEffect } from "react"
import { getAccountSettings } from "@/services/settings.service"

export default function ThemeProvider({ children }: { children: React.ReactNode }) {

  useEffect(() => {
    const applyTheme = (choice: string) => {
      if (choice === "automatic") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light")
      } else {
        document.documentElement.setAttribute("data-theme", choice)
      }
    }

    const saved = localStorage.getItem("theme")

    if (saved) {
      applyTheme(saved)
    } else {
      getAccountSettings()
        .then((settings) => {
          const apiTheme = settings.theme.toLowerCase()
          localStorage.setItem("theme", apiTheme)
          applyTheme(apiTheme)
        })
        .catch(() => {
          applyTheme("dark")
        })
    }
  }, [])

  return <>{children}</>
}