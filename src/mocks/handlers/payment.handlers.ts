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

]