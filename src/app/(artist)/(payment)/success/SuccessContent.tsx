'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { FaCheckCircle } from 'react-icons/fa'

export default function SuccessContent() {
    const searchParams = useSearchParams()

    const plan = searchParams.get('plan') || 'yearly'
    const price = searchParams.get('price') || '0'
    const currency = searchParams.get('currency') || 'EGP'

    const [mounted, setMounted] = useState(false)
    const [receiptNumber] = useState(() => `RCP-${Date.now().toString().slice(-8)}`)
    const [date] = useState(() => new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }))

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return <div className="w-full min-h-screen bg-white" />

    const handleDownload = () => {
        const content = `
========================================
        BEATZA - PAYMENT RECEIPT
========================================

Receipt No:     ${receiptNumber}
Date:           ${date}

----------------------------------------
SUBSCRIPTION DETAILS
----------------------------------------
Plan:           Artist Pro
Billing:        ${plan === 'yearly' ? 'Yearly' : 'Monthly'}
Amount Paid:    ${currency} ${parseFloat(price).toFixed(2)}
${plan === 'yearly' ? `Per Month:      ${currency} ${(parseFloat(price) / 12).toFixed(2)}` : ''}

----------------------------------------
STATUS:         PAYMENT SUCCESSFUL
----------------------------------------

Thank you for subscribing to Beatza Artist Pro.
Your subscription is now active.

For support, visit: beatza.me/need-help
========================================
        `.trim()

        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `beatza-receipt-${receiptNumber}.txt`
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-10">
            <div className="w-full max-w-md">

                {/* Success icon */}
                <div className="flex flex-col items-center mb-8 sm:mb-10">
                    <FaCheckCircle className="text-green-500 text-5xl sm:text-6xl mb-4" />
                    <h1 className="text-2xl sm:text-3xl font-bold text-black text-center">Payment successful!</h1>
                    <p className="text-gray-500 text-sm mt-2 text-center">
                        You are now an Artist Pro subscriber.
                    </p>
                </div>

                {/* Receipt */}
                <div className="border-2 border-gray-200 rounded-2xl p-5 sm:p-8 mb-6 space-y-4">

                    {/* Receipt header */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <div>
                            <h2 className="font-bold text-black text-base sm:text-lg">Beatza</h2>
                            <p className="text-xs text-gray-400">Receipt No. {receiptNumber}</p>
                        </div>
                        <span className="text-xs bg-green-50 text-green-600 font-semibold px-3 py-1 rounded-full">
                            Paid
                        </span>
                    </div>

                    {/* Receipt rows */}
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Date</span>
                            <span className="text-black font-medium">{date}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Plan</span>
                            <span className="text-black font-medium">Artist Pro</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Billing cycle</span>
                            <span className="text-black font-medium capitalize">{plan}</span>
                        </div>
                        {plan === 'yearly' && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Per month</span>
                                <span className="text-black font-medium">
                                    {currency} {(parseFloat(price) / 12).toFixed(2)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                        <span className="font-bold text-black">Total paid</span>
                        <span className="font-black text-black text-lg sm:text-xl">
                            {currency} {parseFloat(price).toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <button
                        onClick={handleDownload}
                        className="w-full py-3 rounded-full border-2 border-black font-semibold text-black text-sm hover:bg-black hover:text-white transition-all"
                    >
                        Download receipt
                    </button>
                    <Link
                        href="/home"
                        className="w-full py-3 rounded-full bg-black font-semibold text-white text-sm hover:bg-gray-800 transition-all flex items-center justify-center"
                    >
                        Go to home
                    </Link>
                </div>
            </div>
        </div>
    )
}