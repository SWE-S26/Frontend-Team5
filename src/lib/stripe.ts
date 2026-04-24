import { loadStripe } from '@stripe/stripe-js'

const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

console.log('Stripe key:', key)
console.log('Stripe key type:', typeof key)

export const stripePromise = loadStripe(key!)