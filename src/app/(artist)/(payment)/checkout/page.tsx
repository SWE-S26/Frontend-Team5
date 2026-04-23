'use client'

import { Suspense } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { stripePromise } from '@/lib/stripe'
import { CheckoutForm } from './CheckoutForm'
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> e5f3fe4 (added - subscription page)
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

<<<<<<< HEAD
=======

export default function CheckoutPage() {
>>>>>>> 077221e (added - implementation - checkout & artist & added success page)
=======
>>>>>>> e5f3fe4 (added - subscription page)
    return (
        <Elements stripe={stripePromise}>
            <Suspense fallback={<div className="w-full min-h-screen bg-white" />}>
                <CheckoutForm />
            </Suspense>
        </Elements>
    )
}