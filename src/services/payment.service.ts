// src/services/payment.service.ts

import api from "@/lib/api"
import {
  PaymentPlansResponse,
  RegisterStripeCustomerRequest,
  RegisterStripeCustomerResponse,
  CreateSubscriptionRequest,
  CreateSubscriptionResponse,
  GetSubscriptionResponse,
  GetTransactionsResponse,
  GetTransactionsParams,
  UpdateSubscriptionRequest,
  UpdateSubscriptionResponse,
  CancelSubscriptionRequest,
  CancelSubscriptionResponse,
} from "@/types/payment.types"

export const paymentService = {

    /* (1) */
    getPlansAuthenticated: () =>
        api.get<PaymentPlansResponse>("/api/payment/v1/plans"),

    /* (2) */
    getPlansPublic: () =>
        api.get<PaymentPlansResponse>("/api/public/payment/v1/plans"),

    /* (3) */
    registerStripeCustomer: (data: RegisterStripeCustomerRequest) =>
        api.post<RegisterStripeCustomerResponse>("/api/payment/v1/user", data),

    /* (4) */
    createSubscription: (data: CreateSubscriptionRequest) =>
        api.post<CreateSubscriptionResponse>("/api/payment/v1/subscriptions", {
            priceId: data.priceId,
            ...(data.promoCode ? { promoCode: data.promoCode } : {}),
        }),

    /* (5) */
    getSubscription: () =>
        api.get<GetSubscriptionResponse>("/api/payment/v1/subscriptions"),

    /* (6) */
    getTransactions: (params?: GetTransactionsParams) =>
        api.get<GetTransactionsResponse>('/api/payment/v1/transactions', { params }),

    /* (7) */
    updateSubscription: (data: UpdateSubscriptionRequest) =>
        api.patch<UpdateSubscriptionResponse>('/api/payment/v1/subscriptions', data),

    /* (8) */
    cancelSubscription: (data: CancelSubscriptionRequest) =>
        api.delete<CancelSubscriptionResponse>('/api/payment/v1/subscriptions', { data }),
}