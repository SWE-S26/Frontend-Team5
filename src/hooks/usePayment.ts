// src/hooks/usePayment.ts

import { useState, useEffect } from "react"
import { useAppSelector } from "@/store/hooks"
import { paymentService } from "@/services/payment.service"
import {
  PaymentPlansData,
  SubscriptionData,
} from "@/types/payment.types"

export const usePaymentPlans = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  const [plans, setPlans] = useState<PaymentPlansData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = isAuthenticated
          ? await paymentService.getPlansAuthenticated()
          : await paymentService.getPlansPublic()
        setPlans(response.data.data)
      } catch {
        if (isAuthenticated) setError("Failed to fetch payment plans")
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [isAuthenticated])

  return { plans, loading, error }
}

export const useCheckout = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null)

  const checkout = async (paymentMethodId: string, priceId: string) => {
    setLoading(true)
    setError(null)
    try {
      // Step 1: Register as Stripe customer
      await paymentService.registerStripeCustomer({ paymentMethodId })

      // Step 2: Create subscription
      const response = await paymentService.createSubscription({ priceId })
      setSubscriptionId(response.data.data?.subscriptionId ?? null)

      return true
    } catch (err: any) {
      setError(err?.response?.data?.message || "Checkout failed")
      return false
    } finally {
      setLoading(false)
    }
  }

  return { checkout, loading, error, subscriptionId }
}

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSubscription = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await paymentService.getSubscription()
        setSubscription(response.data.data)
      } catch {
        setError("Failed to fetch subscription")
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [])

  return { subscription, loading, error }
}