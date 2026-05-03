/* (1) & (2) */
export interface PaymentPlan {
  name: string;
  priceId: string;
  amount: number;
}

export interface PaymentPlansData {
  pro_monthly: PaymentPlan;
  pro_yearly: PaymentPlan;
}

export interface PaymentPlansResponse {
  success: boolean;
  message: string;
  data: PaymentPlansData;
}

/* (3) */
export interface RegisterStripeCustomerRequest {
  paymentMethodId: string;
}

export interface RegisterStripeCustomerResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
  } | null;
}

/* (4) */
export interface CreateSubscriptionRequest {
  priceId: string;
  promoCode?: string;
}

export interface CreateSubscriptionResponse {
  success: boolean;
  message: string;
  data: {
    subscriptionId: string;
  } | null;
}

/* (5) */
export type SubscriptionPlan = "pro_monthly" | "pro_yearly";
export type SubscriptionStatus = "active" | "canceled" | "past_due" | "incomplete";

export interface SubscriptionData {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodEnd: string;
  isStripePayingCustomer: boolean;
}

export interface GetSubscriptionResponse {
  success: boolean;
  message: string;
  data: SubscriptionData | null;
}

/* (6) */
export interface Transaction {
  _id: string;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripeInvoiceId: string | null;
  type: string;
  amount: number;
  currency: string;
  subscriptionType: string;
  description: string;
  discountPercent?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionsData {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetTransactionsResponse {
  success: boolean;
  message: string;
  data: TransactionsData;
}

export interface GetTransactionsParams {
  offset?: number;
  limit?: number;
}

/* (7) */
export interface UpdateSubscriptionRequest {
  priceId: string;
}

export interface UpdateSubscriptionResponse {
  success: boolean;
  message: string;
  data: null;
}

/* (8) */
export interface CancelSubscriptionRequest {
  cancelAtPeriodEnd: boolean;
}

export interface CancelSubscriptionResponse {
  success: boolean;
  message: string;
  data: null;
}
