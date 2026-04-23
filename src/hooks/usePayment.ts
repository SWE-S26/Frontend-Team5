<<<<<<< HEAD
<<<<<<< HEAD
=======
// src/hooks/usePayment.ts

>>>>>>> 077221e (added - implementation - checkout & artist & added success page)
=======
>>>>>>> e5f3fe4 (added - subscription page)
import { useState, useEffect } from "react"
import { useAppSelector } from "@/store/hooks"
import { paymentService } from "@/services/payment.service"
import {
  PaymentPlansData,
  SubscriptionData,
<<<<<<< HEAD
<<<<<<< HEAD
  Transaction,
  GetTransactionsParams,
=======
>>>>>>> 077221e (added - implementation - checkout & artist & added success page)
=======
  Transaction,
  GetTransactionsParams,
>>>>>>> e5f3fe4 (added - subscription page)
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
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> e5f3fe4 (added - subscription page)
      // Step 1: Register as Stripe customer — ignore if already registered
      try {
        await paymentService.registerStripeCustomer({ paymentMethodId })
      } catch (err: any) {
        const message = err?.response?.data?.message || ''
        if (!message.includes('already has a Stripe customer ID')) {
          throw err
        }
      }
<<<<<<< HEAD
=======
      // Step 1: Register as Stripe customer
      await paymentService.registerStripeCustomer({ paymentMethodId })
>>>>>>> 077221e (added - implementation - checkout & artist & added success page)
=======
>>>>>>> e5f3fe4 (added - subscription page)

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
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> e5f3fe4 (added - subscription page)
}

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = async (params?: GetTransactionsParams) => {
    setLoading(true)
    setError(null)
    try {
      const response = await paymentService.getTransactions(params)
      setTransactions(response.data.data.transactions)
      setTotal(response.data.data.total)
    } catch {
      setError('Failed to fetch transactions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  return { transactions, total, loading, error, fetchTransactions }
}

export const useManageSubscription = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateSubscription = async (priceId: string) => {
    setLoading(true)
    setError(null)
    try {
      await paymentService.updateSubscription({ priceId })
      return true
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update subscription')
      return false
    } finally {
      setLoading(false)
    }
  }

  const cancelSubscription = async (cancelAtPeriodEnd: boolean) => {
    setLoading(true)
    setError(null)
    try {
      await paymentService.cancelSubscription({ cancelAtPeriodEnd })
      return true
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to cancel subscription')
      return false
    } finally {
      setLoading(false)
    }
  }

  return { updateSubscription, cancelSubscription, loading, error }
<<<<<<< HEAD
=======
>>>>>>> 077221e (added - implementation - checkout & artist & added success page)
=======
>>>>>>> e5f3fe4 (added - subscription page)
}