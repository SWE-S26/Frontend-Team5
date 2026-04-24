import { http, HttpResponse } from "msw"
import {
  PaymentPlansResponse,
  RegisterStripeCustomerResponse,
  CreateSubscriptionResponse,
  GetSubscriptionResponse,
} from "@/types/payment.types"

const mockPlansResponse: PaymentPlansResponse = {
  success: true,
  message: "Payment plans retrieved successfully",
  data: {
    pro_monthly: {
      name: "Pro Monthly",
      priceId: "price_1TGQ4EKiCVlMQgBUJwZCk3um",
      amount: 9.99,
    },
    pro_yearly: {
      name: "Pro Yearly",
      priceId: "price_1TGj1nKiCVlMQgBU9j8T38Fr",
      amount: 99.99,
    },
  },
}

const mockRegisterStripeCustomerResponse: RegisterStripeCustomerResponse = {
  success: true,
  message: "User created successfully",
  data: { userId: "cus_ABC123XYZ" },
}

const mockCreateSubscriptionResponse: CreateSubscriptionResponse = {
  success: true,
  message: "Subscription created successfully",
  data: { subscriptionId: "sub_123456789" },
}

const mockGetSubscriptionResponse: GetSubscriptionResponse = {
  success: true,
  message: "Subscription retrieved successfully",
  data: {
    plan: "pro_yearly",
    status: "active",
    currentPeriodEnd: "2026-04-01T00:00:00.000Z",
    isStripePayingCustomer: true,
  },
}

export const paymentHandlers = [

  /* (1) */
  http.get("/api/payment/v1/plans", () =>
    HttpResponse.json(mockPlansResponse)
  ),

  /* (2) */
  http.get("/api/public/payment/v1/plans", () =>
    HttpResponse.json(mockPlansResponse)
  ),

  /* (3) */
  http.post("/api/payment/v1/user", () =>
    HttpResponse.json(mockRegisterStripeCustomerResponse, { status: 201 })
  ),

  /* (4) */
  http.post("/api/payment/v1/subscriptions", () =>
    HttpResponse.json(mockCreateSubscriptionResponse, { status: 201 })
  ),

  /* (5) */
  http.get("/api/payment/v1/subscriptions", () =>
    HttpResponse.json(mockGetSubscriptionResponse)
  ),

  /* (6) */
  http.get('/api/payment/v1/transactions', () =>
      HttpResponse.json({
          success: true,
          message: 'Transaction history retrieved successfully',
          data: {
              transactions: [
                  {
                      _id: '69e26df337eb9b75127d4844',
                      userId: '69bc1964148a2e47017de175',
                      stripeCustomerId: 'cus_UFCuogr804sMjP',
                      stripeSubscriptionId: 'sub_1TNGDCKiCVlMQgBUuowzCx2c',
                      stripeInvoiceId: null,
                      type: 'subscription_cancelled',
                      amount: 0,
                      currency: 'usd',
                      subscriptionType: 'pro_monthly',
                      description: 'Subscription cancelled immediately',
                      createdAt: '2026-04-17T17:29:23.657Z',
                      updatedAt: '2026-04-17T17:29:23.657Z',
                  },
                  {
                      _id: '69e26def37eb9b75127d4840',
                      userId: '69bc1964148a2e47017de175',
                      stripeCustomerId: 'cus_UFCuogr804sMjP',
                      stripeSubscriptionId: 'sub_1TNGDCKiCVlMQgBUuowzCx2c',
                      stripeInvoiceId: 'in_1TNGDCKiCVlMQgBUYnSh7oDF',
                      type: 'payment_succeeded',
                      amount: 999,
                      currency: 'usd',
                      subscriptionType: 'pro_monthly',
                      description: 'Payment of 9.99 USD for Pro Monthly',
                      createdAt: '2026-04-17T17:29:19.939Z',
                      updatedAt: '2026-04-17T17:29:19.939Z',
                  },
              ],
              total: 2,
              page: 1,
              limit: 20,
              totalPages: 1,
          },
      })
  ),

  /* (7) */
  http.patch('/api/payment/v1/subscriptions', () =>
      HttpResponse.json({
          success: true,
          message: 'Subscription updated successfully',
          data: null,
      })
  ),

  /* (8) */
  http.delete('/api/payment/v1/subscriptions', () =>
      HttpResponse.json({
          success: true,
          message: 'Subscription cancelled successfully',
          data: null,
      })
  ),

]