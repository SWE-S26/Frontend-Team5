'use client'

import { Suspense } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { stripePromise } from '@/lib/stripe'
import { CheckoutForm } from './CheckoutForm'

export default function CheckoutPage() {
    return (
        <Elements stripe={stripePromise}>
            <Suspense fallback={<div className="w-full min-h-screen bg-white" />}>
                <CheckoutForm />
            </Suspense>
        </Elements>
    )
}