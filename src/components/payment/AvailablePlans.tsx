'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from "@/store/hooks"

interface AvailablePlansProps {
  monthlyPrice: number
  yearlyPrice: number
  currency: string
  onSelectPlan: (plan: { interval: 'monthly' | 'yearly'; price: number }) => void
  isLoading?: boolean
}

export function AvailablePlans({
  monthlyPrice,
  yearlyPrice,
  currency,
  onSelectPlan,
  isLoading = false,
}: AvailablePlansProps) {
    const router = useRouter()
    const [selectedInterval, setSelectedInterval] = useState<'monthly' | 'yearly' | null>(null)

    const handleSelectPlan = (interval: 'monthly' | 'yearly', price: number) => {
        setSelectedInterval(interval)
        onSelectPlan({ interval, price })
        router.push(`/checkout?interval=${interval}`)
    }

    const monthlyTotal = monthlyPrice * 12
    const savings = ((monthlyTotal - yearlyPrice) / monthlyTotal * 100).toFixed(0)

    const role = useAppSelector((state) => state.auth.role)

    return (
        <section className="w-full bg-white px-4 sm:px-6 py-12 sm:py-20 md:px-16 lg:px-20">
            <div className="mx-auto w-full max-w-291">
                <h2 className="mb-10 sm:mb-16 text-center text-4xl sm:text-6xl font-bold text-black mt-8 sm:mt-15">
                    Available plans
                </h2>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-stretch">

<<<<<<< HEAD
                    {/* Monthly Plan Card */}
                    <div
                        onClick={role !== 'Pro' ? () => handleSelectPlan('monthly', monthlyPrice) : undefined}
                        className={`relative rounded-2xl border-2 bg-white p-6 sm:p-8 w-full sm:w-[41%] transition-all duration-200 ${
                            role === 'Pro' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:shadow-lg'
                        } ${selectedInterval === 'monthly' ? 'border-gray-300' : 'border-gray-200'}`}
=======
                    <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-3xl font-bold text-[#545AEC]">{currency} {monthlyPrice}</span>
                        <p className="text-gray-500 text-sm mb-6">/ month, billed yearly for {currency} {(monthlyPrice * 12).toFixed(2)}</p>
                    </div>

                    <hr className="border-gray-200 mb-6" />

                    <ul className="space-y-2 mb-8">
                        {['Cancel anytime', 'Flexible billing'].map((item) => (
                            <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                                <span className="text-[#545AEC]">✓</span>
                                {item}
                            </li>
                        ))}
                    </ul>

                    <button
                        disabled={isLoading}
                        className="w-full rounded-full bg-black py-3 font-semibold text-white transition-all duration-200 hover:bg-gray-800 disabled:opacity-50"
>>>>>>> 077221e (added - implementation - checkout & artist & added success page)
                    >
                        <p className="text-2xl sm:text-4xl font-bold text-black mb-4">Monthly Plan</p>

                        <div className="flex flex-wrap items-baseline gap-1 mb-1">
                            <span className="text-2xl sm:text-3xl font-bold text-[#545AEC]">{currency} {monthlyPrice}</span>
                            <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6">/ month, billed yearly for {currency} {(monthlyPrice * 12).toFixed(2)}</p>
                        </div>

                        <hr className="border-gray-200 mb-4 sm:mb-6" />

                        <ul className="space-y-2 mb-6 sm:mb-8">
                            {['Cancel anytime', 'Flexible billing'].map((item) => (
                                <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                                    <span className="text-[#545AEC]">✓</span>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <button
                            disabled={isLoading || role === 'Pro'}
                            className="w-full rounded-full bg-black py-2.5 sm:py-3 font-semibold text-white transition-all duration-200 hover:bg-gray-800 disabled:opacity-50 text-sm sm:text-base"
                        >
                            {role === 'Pro' ? "You're on Artist Pro" : (isLoading ? 'Processing...' : 'Get started')}
                        </button>
                    </div>

<<<<<<< HEAD
                    {/* Yearly Plan Card */}
                    <div
                        onClick={role !== 'Pro' ? () => handleSelectPlan('yearly', yearlyPrice) : undefined}
                        className={`relative rounded-2xl border-2 bg-orange-50 p-6 sm:p-8 w-full sm:w-[41%] transition-all duration-200 ${
                            role === 'Pro' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:shadow-lg'
                        } ${selectedInterval === 'yearly' ? 'border-[#c79910]' : 'border-orange-300'}`}
=======
                    {selectedInterval === 'yearly' && (
                    <div className="absolute top-4 right-4 w-7 h-7 bg-[#c79910] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                    </div>
                    )}

                    <p className="text-4xl font-bold text-black mb-4">Yearly Plan</p>

                    <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-3xl font-bold text-[#c79910]">{currency} {(yearlyPrice / 12).toFixed(2)}</span>
                        <p className="text-gray-500 text-sm mb-6">/ month, billed yearly for {currency} {yearlyPrice}</p>
                    </div>

                    <hr className="border-orange-200 mb-6" />

                    <ul className="space-y-2 mb-8">
                        {['Best value', `Save ${savings}%`].map((item) => (
                            <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                                <span className="text-[#c79910]">✓</span>
                                {item}
                            </li>
                        ))}
                    </ul>

                    <button
                        disabled={isLoading}
                        className="w-full rounded-full bg-[#c79910] py-3 font-semibold text-white transition-all duration-200 hover:bg-[#b08a0e] disabled:opacity-50"
>>>>>>> 077221e (added - implementation - checkout & artist & added success page)
                    >
                        <div className="absolute -top-4 left-6 bg-[#c79910] text-white text-xs font-bold px-4 py-1.5 rounded-full">
                            MOST POPULAR
                        </div>

                        {selectedInterval === 'yearly' && (
                            <div className="absolute top-4 right-4 w-7 h-7 bg-[#c79910] rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                            </div>
                        )}

                        <p className="text-2xl sm:text-4xl font-bold text-black mb-4">Yearly Plan</p>

                        <div className="flex flex-wrap items-baseline gap-1 mb-1">
                            <span className="text-2xl sm:text-3xl font-bold text-[#c79910]">{currency} {(yearlyPrice / 12).toFixed(2)}</span>
                            <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6">/ month, billed yearly for {currency} {yearlyPrice}</p>
                        </div>

                        <hr className="border-orange-200 mb-4 sm:mb-6" />

                        <ul className="space-y-2 mb-6 sm:mb-8">
                            {['Best value', `Save ${savings}%`].map((item) => (
                                <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                                    <span className="text-[#c79910]">✓</span>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <button
                            disabled={isLoading || role === 'Pro'}
                            className="w-full rounded-full bg-[#c79910] py-2.5 sm:py-3 font-semibold text-white transition-all duration-200 hover:bg-[#b08a0e] disabled:opacity-50 text-sm sm:text-base"
                        >
                            {role === 'Pro' ? "You're on Artist Pro" : (isLoading ? 'Processing...' : 'Get started')}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}