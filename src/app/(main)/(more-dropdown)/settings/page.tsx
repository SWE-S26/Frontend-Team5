"use client"
import { useState } from "react"
import ThemeSwitcher from "@/components/theme/ThemeSwitcher"
import Button from "@/components/ui/Button"

export default function Settings() {
  const [emailSent, setEmailSent] = useState(false)
  
  return (
    <div className="bg-chinese-black">
      <ThemeSwitcher />

      <div className="my-5 font-bold">
        <h1 className="mb-3">Password</h1>
        {emailSent && (
          <p className="text-silver text-xs mb-2">
            We've sent an email to ### with a link to reset your password.
          </p>
        )}
        <Button
          className="px-3 py-2 bg-off-black text-white-smoke text-xs cursor-pointer hover:text-silver"
          onClick={() => { setEmailSent(true); setTimeout(() => setEmailSent(false), 5000) }}
        >
          Send password-reset link
        </Button>
      </div>
    </div>
  )
}