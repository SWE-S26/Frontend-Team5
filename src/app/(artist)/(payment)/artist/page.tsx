'use client'

import { useRef, useState } from 'react'
import Link from "next/link";
import Image from "next/image"

import { useAppSelector } from "@/store/hooks"
import { useLogout } from "@/hooks/useAuth"
import { HeroSection } from '@/components/payment/HeroSection'
import { AvailablePlans } from '@/components/payment/AvailablePlans'
import { CompareFeatures } from '@/components/payment/CompareFeatures'

import { IoIosArrowDown } from "react-icons/io";

// TODO: Replace with actual values from your config/backend
const PRICING_CONFIG = {
  monthlyPrice: 29.99,
  yearlyPrice: 74.99,
  currency: 'EGP',
}

export default function ArtistPage() {
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

    // only pulling the two fields this component actually needs
    const profileImgLink = useAppSelector((state) => state.auth.profileImgLink)
    const displayName = useAppSelector((state) => state.auth.displayName)

    const { logout, loading, success } = useLogout()

    const plansRef = useRef<HTMLDivElement>(null)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const handleScrollToPlans = () => {
        plansRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleSelectPlan = (plan: { interval: 'monthly' | 'yearly'; price: number }) => {
        console.log('Selected plan:', plan)
        // TODO: Redirect to Stripe checkout with plan selection
        // Example: router.push(`/checkout?interval=${plan.interval}`)
    }

    const handleUpgrade = () => {
        handleSelectPlan({ interval: 'yearly', price: PRICING_CONFIG.yearlyPrice })
    }

    const handleSignOut = () => {
        setIsDropdownOpen(false)
        logout()
    }

    return (
        <div className="w-full">

            {/* Header */}
            <div className="flex justify-center bg-[#333333]">
                <div className="flex items-center justify-between h-11.5 w-full max-w-291">
                    <div>
                        <Link data-testid="navbar_logo" href={isAuthenticated ? "/home" : "/"} className="flex items-center">
                            <img src="/app-logo/beatza.png" alt="BeatZa" className="w-8 sm:w-10 sm:h-6 mr-1.5 mt-1"/>
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
                                        src={profileImgLink || "/profpic.jpg"}
                                        alt="Profile"
                                        width={26}
                                        height={26}
                                        className="rounded-full w-6.5 h-6.5 object-cover mr-2"
                                        />
                                        <h1 className="text-white-smoke font-bold text-[14px] mr-2 hover:opacity-80 transition-opacity">{displayName}</h1>
                                    </div>
                                    <IoIosArrowDown/>
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
            
            {/* Hero Section */}
            <HeroSection onScrollToPlans={handleScrollToPlans} />

            {/* Available Plans Section */}
            <div ref={plansRef}>
                <AvailablePlans
                    monthlyPrice={PRICING_CONFIG.monthlyPrice}
                    yearlyPrice={PRICING_CONFIG.yearlyPrice}
                    currency={PRICING_CONFIG.currency}
                    onSelectPlan={handleSelectPlan}
                />
            </div>

            {/* Compare Features Section */}
            <CompareFeatures
                currentUserRole="listener"
                onUpgrade={handleScrollToPlans}
                proPrice={PRICING_CONFIG.yearlyPrice}
                currency={PRICING_CONFIG.currency}
            />

            {/* Footer */}
            <div className="px-20 pb-20 bg-white">
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
                <hr className="border-gray-200 mb-1" />
                <div className="flex items-center gap-2 text-xs text-blue-600">
                    <Link href="/legal" className="hover:underline">Legal</Link>
                    <span className="text-gray-400">-</span>
                    <Link href="/privacy" className="hover:underline">Privacy</Link>
                </div>
            </div>

        </div>
    )
}