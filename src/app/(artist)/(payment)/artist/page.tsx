'use client'

import { useRef, useState, useEffect } from 'react'
import Link from "next/link";
import Image from "next/image"

import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { useLogout } from "@/hooks/useAuth"
import { usePaymentPlans } from "@/hooks/usePayment"
import { useGetProfile } from "@/hooks/useProfile"
import { setProfile, clearProfile } from "@/store/slices/profileSlice"
import { HeroSection } from '@/components/payment/HeroSection'
import { AvailablePlans } from '@/components/payment/AvailablePlans'
import { CompareFeatures } from '@/components/payment/CompareFeatures'

import { IoIosArrowDown } from "react-icons/io";

const CURRENCY = '$'

export default function ArtistPage() {
    const dispatch = useAppDispatch()

    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
    const profileImgLink  = useAppSelector((state) => state.auth.profileImgLink)
    const displayName     = useAppSelector((state) => state.auth.displayName)
    const userId          = useAppSelector((state) => state.auth.userId)
    const hasHydrated     = useAppSelector((state) => state.auth.hasHydrated)

    const profileFirstName = useAppSelector((state) => state.profile.firstName)
    const profileLastName  = useAppSelector((state) => state.profile.lastName)

    const { getProfile } = useGetProfile()

    useEffect(() => {
        if (!hasHydrated || !userId) return

        getProfile(userId).then((data) => {
            if (!data) return
            dispatch(setProfile({
                userId:         data.userId,
                displayName:    data.displayName,
                firstName:      data.firstName,
                lastName:       data.lastName,
                profileImgLink: data.profileImgLink,
                bannerImgLink:  data.bannerImgLink,
                city:           data.city,
                country:        data.country,
                isOwnProfile:   true,
            }))
        })

        return () => { dispatch(clearProfile()) }
    }, [userId, hasHydrated])

    const { logout } = useLogout()
    const { plans, loading, error } = usePaymentPlans()

    const plansRef = useRef<HTMLDivElement>(null)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const headerName = profileFirstName || profileLastName
        ? `${profileFirstName || ''} ${profileLastName || ''}`.trim()
        : displayName

    const handleScrollToPlans = () => {
        plansRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleSelectPlan = (plan: { interval: 'monthly' | 'yearly'; price: number }) => {
        console.log('Selected plan:', plan)
    }

    const handleSignOut = () => {
        setIsDropdownOpen(false)
        logout()
    }

    return (
        <div className="w-full">

            {/* Header */}
            <div className="flex justify-center bg-[#333333] fixed top-0 z-1000 w-full">
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
                                        <h1 className="text-white-smoke font-bold text-[14px] mr-2 hover:opacity-80 transition-opacity truncate max-w-33">
                                            {headerName}
                                        </h1>
                                    </div>
                                    <IoIosArrowDown/>
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute top-full right-0 bg-[#101010] w-45 z-50">
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full px-4 py-2 text-left hover:bg-[#333333] text-sm text-white-smoke"
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
                {loading && (
                    <div className="w-full bg-white flex justify-center py-20">
                        <p className="text-gray-400 text-sm">Loading plans...</p>
                    </div>
                )}
                {error && (
                    <div className="w-full bg-white flex justify-center py-20">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}
                {!loading && !error && plans && (
                    <AvailablePlans
                        monthlyPrice={plans.pro_monthly.amount}
                        yearlyPrice={plans.pro_yearly.amount}
                        currency={CURRENCY}
                        onSelectPlan={handleSelectPlan}
                    />
                )}
            </div>

            {/* Compare Features Section */}
            {plans && (
                <CompareFeatures
                    onUpgrade={handleScrollToPlans}
                    proPrice={plans?.pro_yearly.amount ?? 0}
                    currency={CURRENCY}
                />
            )}

            {/* Footer */}
            <div className="px-4 sm:px-20 pb-10 sm:pb-20 bg-white">
                {isAuthenticated && (
                    <p className="text-xs text-gray-600 mb-1">
                        Signed in as {headerName}. 
                        <button onClick={handleSignOut} className="ml-1 text-gray-600 underline hover:text-black">
                            Sign out
                        </button>
                    </p>
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