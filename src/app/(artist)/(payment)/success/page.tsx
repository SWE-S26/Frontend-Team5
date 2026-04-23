'use client'

import { Suspense, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import SuccessContent from './SuccessContent'

export default function Page() {
    const role = useAppSelector((state) => state.auth.role)
    const router = useRouter()

    useEffect(() => {
        if (role === 'Pro') {
            router.replace('/alreadypro')
        } else if (role === 'Listener') {
            router.replace('/checkout')
        }
    }, [role])

    return (
        <Suspense fallback={<div className="w-full min-h-screen bg-white" />}>
            <SuccessContent />
        </Suspense>
    )
}