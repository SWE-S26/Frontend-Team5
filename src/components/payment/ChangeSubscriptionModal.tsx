"use client"

import { useState, useEffect } from "react"
import Button from "@/components/ui/Button"
import { usePaymentPlans, useManageSubscription } from "@/hooks/usePayment"
import { useRefreshToken } from "@/hooks/useAuth"

interface ChangeSubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  currentPlan: string // 'pro_monthly' | 'pro_yearly'
  onSuccess: () => void
}

export default function ChangeSubscriptionModal({ isOpen, onClose, currentPlan, onSuccess }: ChangeSubscriptionModalProps) {
  const [shouldRender, setShouldRender] = useState(false)
  const [animate, setAnimate] = useState(false)

  const { plans, loading: plansLoading } = usePaymentPlans()
  const { updateSubscription, loading, error } = useManageSubscription()
  const { refreshToken } = useRefreshToken()

  const isCurrentlyMonthly = currentPlan === 'pro_monthly'
  const targetPlan = isCurrentlyMonthly ? plans?.pro_yearly : plans?.pro_monthly
  const targetLabel = isCurrentlyMonthly ? 'Yearly' : 'Monthly'
  const currentLabel = isCurrentlyMonthly ? 'Monthly' : 'Yearly'

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      const timer = setTimeout(() => setAnimate(true), 20)
      return () => clearTimeout(timer)
    } else {
      setAnimate(false)
      const timer = setTimeout(() => setShouldRender(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!shouldRender) return null

  const handleChange = async () => {
    if (!targetPlan) return
    const success = await updateSubscription(targetPlan.priceId)
    if (success) {
      await refreshToken()
      onClose()
      onSuccess()
    }
  }

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
          <h2 className="text-xl font-bold">Change Subscription</h2>

          {plansLoading ? (
            <p className="text-silver text-sm">Loading plans...</p>
          ) : (
            <>
              {/* Current plan */}
              <div className="bg-off-black rounded-sm p-4">
                <p className="text-xs text-silver mb-1">Current plan</p>
                <p className="font-bold text-white-smoke">Artist Pro — {currentLabel}</p>
                <p className="text-sm text-silver mt-1">
                  {isCurrentlyMonthly
                    ? `$${plans?.pro_monthly.amount.toFixed(2)} / month`
                    : `$${plans?.pro_yearly.amount.toFixed(2)} / year ($${(plans!.pro_yearly.amount / 12).toFixed(2)}/month)`
                  }
                </p>
              </div>

              {/* Arrow */}
              <div className="flex justify-center text-silver text-xl">↓</div>

              {/* Target plan */}
              <div className="bg-off-black rounded-sm p-4 border border-white/10">
                <p className="text-xs text-silver mb-1">You will switch to</p>
                <p className="font-bold text-white-smoke">Artist Pro — {targetLabel}</p>
                <p className="text-sm text-silver mt-1">
                  {isCurrentlyMonthly
                    ? `$${plans?.pro_yearly.amount.toFixed(2)} / year ($${(plans!.pro_yearly.amount / 12).toFixed(2)}/month)`
                    : `$${plans?.pro_monthly.amount.toFixed(2)} / month`
                  }
                </p>
              </div>

              {error && <p className="text-red-500 text-xs">{error}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  onClick={onClose}
                  disabled={loading}
                  className="text-silver hover:text-white-smoke bg-off-black disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleChange}
                  disabled={loading || plansLoading}
                  className="bg-white-smoke text-chinese-black disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating...' : `Switch to ${targetLabel}`}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}