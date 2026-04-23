// src/components/payment/CancelSubscriptionModal.tsx
"use client"

import { useState, useEffect } from "react"
import { IoWarningOutline } from "react-icons/io5"
import Button from "@/components/ui/Button"

interface CancelSubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (cancelAtPeriodEnd: boolean) => void
  isLoading: boolean
  error: string | null
}

export default function CancelSubscriptionModal({ isOpen, onClose, onConfirm, isLoading, error }: CancelSubscriptionModalProps) {
  const [shouldRender, setShouldRender] = useState(false)
  const [animate, setAnimate] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      const timer = setTimeout(() => setAnimate(true), 20)
      return () => clearTimeout(timer)
    } else {
      setAnimate(false)
      setConfirmed(false)
      const timer = setTimeout(() => setShouldRender(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!shouldRender) return null

  return (
    <div
      className={`fixed inset-0 z-1001 flex items-start sm:items-center justify-center overflow-y-auto p-4 sm:p-0 bg-login transition-opacity duration-500 ease-in-out ${
        animate ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`relative mt-6 sm:mt-0 w-full max-w-110 max-h-[95vh] overflow-y-auto pb-10 p-6 sm:p-8 bg-chinese-black text-white-smoke shadow-2xl border rounded border-white/10 transform transition-transform duration-500 ${
          animate ? "translate-y-0" : "-translate-y-[150vh]"
        }`}
      >
        <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
                <IoWarningOutline size={28} className="text-red-500 shrink-0" />
                <h2 className="text-xl font-bold">Cancel Subscription</h2>
            </div>

            <p className="text-silver text-sm leading-relaxed">
                Are you sure you want to cancel your Artist Pro subscription? You will lose access to:
            </p>

            <ul className="text-silver text-sm space-y-1 list-disc list-inside">
                <li>Unlimited track uploads</li>
                <li>Advanced audience stats</li>
                <li>Track promotion and playlisting</li>
                <li>Distribution to 60+ platforms</li>
                <li>Priority support</li>
            </ul>

            <p className="text-silver text-xs leading-relaxed">
                Your subscription will remain active until the end of the current billing period.
            </p>

            <label className="flex items-start gap-3 cursor-pointer group">
                <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-0.5 accent-red-500 cursor-pointer"
                />
                <span className="text-silver text-xs leading-relaxed group-hover:text-white-smoke transition-colors">
                Yes, I understand I will lose access to Artist Pro features and want to cancel my subscription.
                </span>
            </label>

            {error && <p className="text-red-500 text-xs">{error}</p>}

            <div className="flex justify-end gap-3 pt-2">
                <Button
                    onClick={onClose}
                    disabled={isLoading}
                    className="text-silver hover:text-white-smoke bg-off-black disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Keep Subscription
                </Button>
                <Button
                    onClick={() => onConfirm(false)}
                    disabled={!confirmed || isLoading}
                    className="text-white bg-red-800 hover:bg-red-900 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Cancelling..." : "Cancel Immediately"}
                </Button>
                <Button
                    onClick={() => onConfirm(true)}
                    disabled={!confirmed || isLoading}
                    className="text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Cancelling..." : "Cancel at Period End"}
                </Button>
            </div>
        </div>
      </div>
    </div>
  )
}