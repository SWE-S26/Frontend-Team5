'use client'

import { Suspense } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { stripePromise } from '@/lib/stripe'
import { CheckoutForm } from './CheckoutForm'
<<<<<<< HEAD
import { useAppSelector } from '@/store/hooks'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function CheckoutPage() {
    const role = useAppSelector((state) => state.auth.role)
    const router = useRouter()

    useEffect(() => {
        if (role === 'Pro') {
            router.replace('/alreadypro')
        }
    }, [role])

=======

export default function CheckoutPage() {
>>>>>>> 077221e (added - implementation - checkout & artist & added success page)
    return (
        <Elements stripe={stripePromise}>
            <Suspense fallback={<div className="w-full min-h-screen bg-white" />}>
                <CheckoutForm />
            </Suspense>
        </Elements>
    )
}