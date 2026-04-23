/* (1) & (2) */
export interface PaymentPlan {
  name: string
  priceId: string
  amount: number
}

export interface PaymentPlansData {
  pro_monthly: PaymentPlan
  pro_yearly: PaymentPlan
}

export interface PaymentPlansResponse {
  success: boolean
  message: string
  data: PaymentPlansData
}

/* (3) */
export interface RegisterStripeCustomerRequest {
  paymentMethodId: string
}

export interface RegisterStripeCustomerResponse {
  success: boolean
  message: string
  data: {
    userId: string
  } | null
}


/* (4) */
export interface CreateSubscriptionRequest {
  priceId: string
}

export interface CreateSubscriptionResponse {
  success: boolean
  message: string
  data: {
    subscriptionId: string
  } | null
}


/* (5) */
export type SubscriptionPlan = 'pro_monthly' | 'pro_yearly'
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'incomplete'

export interface SubscriptionData {
  plan: SubscriptionPlan
  status: SubscriptionStatus
  currentPeriodEnd: string
  isStripePayingCustomer: boolean
}

export interface GetSubscriptionResponse {
  success: boolean
  message: string
  data: SubscriptionData | null
}