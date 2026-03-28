"use client"
import { useState } from "react"
import ThemeSwitcher from "@/components/settings/theme/ThemeSwitcher"
import Button from "@/components/ui/Button"
import DeleteAccountModal from "@/components/settings/DeleteAccountModal"
import { useForgotPasswordLoggedIn } from "@/hooks/useAuth"

export default function Settings() {
  const [showSuccess,      setShowSuccess]      = useState(false)
  const [deleteModalOpen,  setDeleteModalOpen]  = useState(false)
  const { forgotPasswordLoggedIn, loading, error } = useForgotPasswordLoggedIn()

  const handleResetPassword = async () => {
    const res = await forgotPasswordLoggedIn()
    if (res) {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 5000)
    }
  }

  return (
    <div className="bg-chinese-black">
      <ThemeSwitcher />

      <div className="my-5 font-bold">
        <h1 className="mb-3">Password</h1>
        {showSuccess && (
          <p className="text-silver text-xs mb-2">
            We've sent you an email with a link to reset your password.
          </p>
        )}
        {error && (
          <p className="text-anger text-xs mb-2">{error}</p>
        )}
        <Button
          className="px-3 py-2 bg-off-black text-white-smoke text-xs cursor-pointer hover:text-silver"
          onClick={handleResetPassword}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send password-reset link"}
        </Button>
      </div>

      <Button
        className="text-red-500 text-sm cursor-pointer"
        onClick={() => setDeleteModalOpen(true)}
      >
        Delete Account
      </Button>
      <DeleteAccountModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  )
}