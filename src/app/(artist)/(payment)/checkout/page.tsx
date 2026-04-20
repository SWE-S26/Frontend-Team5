'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

import { useAppSelector } from '@/store/hooks'
import { useLogout } from '@/hooks/useAuth'
import CB from '@/components/settings/CB'
import { IoIosArrowDown } from 'react-icons/io'
import { FaLock } from 'react-icons/fa'

const PRICING_CONFIG = {
    monthlyPrice: 149.99,
    yearlyPrice: 899.88,
    yearlyMonthly: 74.99,
    currency: 'EGP',
}

type BillingInterval = 'monthly' | 'yearly'

export default function CheckoutPage() {
    const searchParams = useSearchParams()
    const intervalParam = searchParams.get('interval') as BillingInterval | null

    const [showCoupon, setShowCoupon] = useState(false)
    const [couponCode, setCouponCode] = useState('')
    const [showBillingAddress, setShowBillingAddress] = useState(false)
    const [selectedInterval, setSelectedInterval] = useState<BillingInterval>(intervalParam || 'yearly')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
    const profileImgLink = useAppSelector((state) => state.auth.profileImgLink)
    const displayName = useAppSelector((state) => state.auth.displayName)

    const { logout } = useLogout()

    const handleSignOut = () => {
        setIsDropdownOpen(false)
        logout()
    }

    const totalPrice = selectedInterval === 'yearly'
        ? PRICING_CONFIG.yearlyPrice
        : PRICING_CONFIG.monthlyPrice

    const handleBuySubscription = () => {
        console.log('Buy subscription:', { interval: selectedInterval, total: totalPrice })
    }

    return (
        <div className="w-full min-h-screen bg-white">

            {/* Header */}
            <div className="flex justify-center bg-[#333333]">
                <div className="flex items-center justify-between h-11.5 w-full max-w-291">
                    <div>
                        <Link data-testid="navbar_logo" href={isAuthenticated ? '/home' : '/'} className="flex items-center">
                            <img src="/app-logo/beatza.png" alt="BeatZa" className="w-8 sm:w-10 sm:h-6 mr-1.5 mt-1" />
                            <h1 className="text-white-smoke font-bold text-[14px] mr-2">CRAVING TUNES</h1>
                        </Link>
                    </div>
                    <div className="flex w-45 relative overflow-visible">
                        {isAuthenticated && (
                            <>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className={`cursor-pointer flex items-center w-full h-11.5 justify-between px-2 ${isDropdownOpen ? 'bg-[#101010]' : ''}`}
                                >
                                    <div className="flex items-center">
                                        <Image
                                            src={profileImgLink || '/profpic.jpg'}
                                            alt="Profile"
                                            width={26}
                                            height={26}
                                            className="rounded-full w-6.5 h-6.5 object-cover mr-2"
                                        />
                                        <h1 className="text-white-smoke font-bold text-[14px] mr-2 hover:opacity-80 transition-opacity">{displayName}</h1>
                                    </div>
                                    <IoIosArrowDown />
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute top-full right-0 bg-[#101010] w-45 z-50">
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full px-4 py-2 text-left hover:bg-[#333333] text-sm"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex justify-center px-6 py-12">
                <div className="w-full max-w-291">

                    <h1 className="text-3xl font-bold text-black mb-10">Get Artist Pro</h1>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-12">

                        {/* Left Column */}
                        <div className="md:col-span-3 space-y-10">

                            {/* 1. Billing Cycle */}
                            <div>
                                <h2 className="text-xl font-bold text-black mb-6">1. Billing cycle</h2>
                                <div className="space-y-3">

                                    {/* Yearly option */}
                                    <button
                                        onClick={() => setSelectedInterval('yearly')}
                                        className={`w-full flex items-center justify-between p-4 border-2 rounded-lg text-left transition-all ${
                                            selectedInterval === 'yearly' ? 'border-orange-500' : 'border-gray-200'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                                selectedInterval === 'yearly' ? 'border-orange-500' : 'border-gray-300'
                                            }`}>
                                                {selectedInterval === 'yearly' && (
                                                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-black">Yearly billing</p>
                                                <p className="text-sm text-gray-500">
                                                    {PRICING_CONFIG.currency} {PRICING_CONFIG.yearlyPrice.toFixed(2)}, that&apos;s {PRICING_CONFIG.currency} {PRICING_CONFIG.yearlyMonthly}/month
                                                </p>
                                            </div>
                                        </div>
                                        {selectedInterval === 'yearly' && (
                                            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">
                                                50% YEARLY DISCOUNT
                                            </span>
                                        )}
                                    </button>

                                    {/* Monthly option */}
                                    <button
                                        onClick={() => setSelectedInterval('monthly')}
                                        className={`w-full flex items-center justify-between p-4 border-2 rounded-lg text-left transition-all ${
                                            selectedInterval === 'monthly' ? 'border-orange-500' : 'border-gray-200'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                                selectedInterval === 'monthly' ? 'border-orange-500' : 'border-gray-300'
                                            }`}>
                                                {selectedInterval === 'monthly' && (
                                                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-black">Monthly billing</p>
                                                <p className="text-sm text-gray-500">
                                                    {PRICING_CONFIG.currency} {PRICING_CONFIG.monthlyPrice}/month
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* 2. Payment Details */}
                            <div>
                                <div className="flex items-center gap-2 mb-6">
                                    <h2 className="text-xl font-bold text-black">2. Payment details</h2>
                                    <FaLock className="text-gray-400 text-sm" />
                                </div>

                                <div className="space-y-3">
                                    <input type="text" placeholder="First name" className="w-full bg-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none" />
                                    <input type="text" placeholder="Surname" className="w-full bg-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none" />

                                    <div className="relative">
                                        <input type="text" placeholder="Card number" className="w-full bg-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none pr-12" />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">💳</span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        <input type="text" placeholder="Expiration month" className="bg-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none" />
                                        <input type="text" placeholder="Expiration year" className="bg-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none" />
                                        <div className="relative">
                                            <input type="text" placeholder="CVV" className="w-full bg-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none pr-10" />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <select className="w-full bg-gray-100 rounded-lg px-4 pt-5 pb-2 text-sm text-gray-700 outline-none appearance-none">
                                            <option value="EG">Egypt</option>
                                            <option value="US">United States</option>
                                            <option value="GB">United Kingdom</option>
                                        </select>
                                        <p className="absolute left-4 top-1.5 text-[10px] text-gray-400">Billing Country</p>
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▾</span>
                                    </div>

                                    <input type="text" placeholder="Postcode (optional)" className="w-full bg-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none" />

                                    {/* Billing address checkbox */}
                                    <div className="flex items-center gap-2 pt-1">
                                        <CB checked={showBillingAddress} onChange={setShowBillingAddress} />
                                        <span className="text-sm font-medium text-black">Add billing address (visible on invoice)</span>
                                    </div>

                                    {/* Billing address fields */}
                                    {showBillingAddress && (
                                        <div className="space-y-3">
                                            <input type="text" placeholder="Full name (optional)" className="w-full bg-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none" />
                                            <input type="text" placeholder="Company (optional)" className="w-full bg-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none" />
                                            <input type="text" placeholder="Street Address (optional)" className="w-full bg-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none" />
                                            <input type="text" placeholder="City (optional)" className="w-full bg-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Review Purchase */}
                        <div className="md:col-span-2">
                            <h2 className="text-xl font-bold text-black mb-6">3. Review your purchase</h2>

                            {/* Plan info */}
                            <div className="flex items-center gap-3 mb-4">
                                <img src="/app-logo/beatza.png" alt="BeatZa" className="w-10 h-10" />
                                <span className="text-lg font-bold text-black">Artist Pro</span>
                            </div>

                            <button
                                onClick={() => setShowCoupon(!showCoupon)}
                                className="text-orange-500 text-sm hover:underline mb-4 block"
                            >
                                Do you have a coupon code?
                            </button>

                            {showCoupon && (
                                <div className="flex gap-2 mb-6">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        placeholder="Enter coupon code"
                                        className="flex-1 bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700 outline-none"
                                    />
                                    <button className="bg-black text-white px-5 py-2 rounded-full font-semibold text-sm hover:bg-gray-800">
                                        Apply
                                    </button>
                                </div>
                            )}

                            {/* Order summary */}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="font-bold text-black">Total</span>
                                    <span className="font-bold text-black text-lg">
                                        {PRICING_CONFIG.currency} {totalPrice.toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center mb-6">
                                    <span className="font-semibold text-black text-sm">Billing cycle</span>
                                    <span className="text-sm text-black capitalize">{selectedInterval}</span>
                                </div>

                                <p className="text-xs text-gray-500 mb-4">
                                    Subscription will automatically renew at {PRICING_CONFIG.currency} {totalPrice.toFixed(2)} every {selectedInterval === 'yearly' ? 'year' : 'month'}, unless you cancel before the day of your next renewal in your subscription settings.
                                </p>

                                <p className="text-xs text-gray-400">All prices in {PRICING_CONFIG.currency}</p>
                            </div>

                            {/* Buy button */}
                            <button
                                onClick={handleBuySubscription}
                                className="w-full py-3 rounded-lg font-semibold text-white transition-all bg-gray-500 hover:bg-gray-600"
                            >
                                Buy subscription
                            </button>

                            <p className="text-xs text-gray-500 mt-4">
                                By submitting your payment information and clicking Buy subscription you agree to the{' '}
                                <Link href="/terms" className="text-blue-600 hover:underline">Terms of Use for Artist Subscriptions</Link>
                                {' '}and{' '}
                                <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="pb-10 bg-white w-full max-w-291 flex flex-col mx-auto">
                {isAuthenticated && (
                            <>
                                <p className="text-xs text-gray-600 mb-1">
                                    Signed in as {displayName}. 
                                    <button onClick={handleSignOut} className="ml-1 text-gray-600 underline hover:text-black">
                                        Sign out
                                    </button>
                                </p>
                            </>
                )}
                <hr className="border-gray-200 mb-1 w-full" />
                <div className="flex items-center gap-2 text-xs text-blue-600">
                    <Link href="/legal" className="hover:underline">Legal</Link>
                    <span className="text-gray-400">-</span>
                    <Link href="/privacy" className="hover:underline">Privacy</Link>
                </div>
            </div>
        </div>
    )
}