"use client"
import { useState, useEffect } from "react"

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState("dark")

  useEffect(() => {
    const current = localStorage.getItem("theme") || "dark"
    setTheme(current)

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    function applyTheme(choice: string) {
      if (choice === "automatic") {
        document.documentElement.setAttribute("data-theme", mediaQuery.matches ? "dark" : "light")
      } else {
        document.documentElement.setAttribute("data-theme", choice)
      }
    }

    function handleSystemThemeChange() {
      const saved = localStorage.getItem("theme")
      if (saved === "automatic") applyTheme("automatic")
    }

    mediaQuery.addEventListener("change", handleSystemThemeChange)
    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange)
  }, [])

  function changeTheme(value: string) {
    setTheme(value)
    localStorage.setItem("theme", value)

    if (value === "automatic") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light")
    } else {
      document.documentElement.setAttribute("data-theme", value)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-white-smoke font-bold mb-2">Change theme</h2>
      {["light", "dark", "automatic"].map((option) => (
        <button key={option} onClick={() => changeTheme(option)}
          className="flex items-center gap-3 text-white-smoke font-bold capitalize w-fit transition-all duration-300 group">
          <div className="w-5 h-5 rounded-full border-2 border-silver flex items-center justify-center self-start mt-0.5">
            {theme === option
              ? <div className="w-2.5 h-2.5 rounded-full bg-white-smoke group-hover:bg-silver transition-all duration-300" />
              : <div className="w-2.5 h-2.5 rounded-full bg-transparent group-hover:bg-silver transition-all duration-300" />
            }
          </div>
          <div className="flex flex-col items-start">
            {option}
            {option === "automatic" && (
              <span className={`text-silver text-xs font-normal normal-case overflow-hidden transition-all duration-300 ${theme === "automatic" ? "max-h-10 opacity-100 mt-0.5" : "max-h-0 opacity-0"}`}>
                Your system's theme preferences will be used.
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  )
}