'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import SuccessContent from './SuccessContent'

function SuccessPage() {
    const role = useAppSelector((state) => state.auth.role)
    const router = useRouter()
    const searchParams = useSearchParams()
    const fromCheckout = searchParams.get('from') === 'checkout'

    useEffect(() => {
        if (!fromCheckout) {
            if (role === 'Pro') {
                router.replace('/alreadypro')
            } else {
                router.replace('/checkout')
            }
        }
    }, [role, fromCheckout])

    return <SuccessContent />
}

export default function Page() {
    return (
        <Suspense fallback={<div className="w-full min-h-screen bg-white" />}>
            <SuccessPage />
        </Suspense>
    )
}