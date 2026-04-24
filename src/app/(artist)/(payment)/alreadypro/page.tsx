'use client'

import { useState, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { useLogout } from '@/hooks/useAuth'
import { useGetProfile } from '@/hooks/useProfile'
import { setProfile, clearProfile } from '@/store/slices/profileSlice'
import Link from 'next/link'
import { IoIosArrowDown } from 'react-icons/io'
import ProfileImage from "@/components/ui/ProfileImage"

export default function page() {
    const dispatch = useAppDispatch()

    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
    const profileImgLink  = useAppSelector((state) => state.auth.profileImgLink)
    const displayName     = useAppSelector((state) => state.auth.displayName)
    const userId          = useAppSelector((state) => state.auth.userId)
    const hasHydrated     = useAppSelector((state) => state.auth.hasHydrated)

    const firstName = useAppSelector((state) => state.profile.firstName)
    const lastName  = useAppSelector((state) => state.profile.lastName)
    const city      = useAppSelector((state) => state.profile.city)

    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const { logout } = useLogout()
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

    const handleSignOut = () => {
        setIsDropdownOpen(false)
        logout()
    }

    const fullName = firstName || lastName
        ? `${firstName || ''} ${lastName || ''}`.trim()
        : displayName || 'No Name'

    return (
        <div className="flex flex-col h-screen overflow-hidden md:overflow-hidden overflow-y-auto">

            {/* Header */}
            <div className="flex justify-center bg-[#333333] w-full shrink-0">
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
                                    <ProfileImage
                                        src={profileImgLink}
                                        alt="Profile"
                                        width={26}
                                        height={26}
                                        className="rounded-full w-6.5 h-6.5 object-cover mr-2"
                                    />
                                        <h1 className="text-white-smoke font-bold text-[14px] mr-2 hover:opacity-80 transition-opacity truncate max-w-33">
                                            {fullName}
                                        </h1>
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

            {/* Content — fills remaining height */}
            <div
                className="flex-1 flex flex-col md:flex-row items-center justify-between px-8 py-12 md:px-18 gap-12"
                style={{
                    backgroundImage: "url('/payment/already-pro-bg.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                {/* Left — text */}
                <div className="w-full md:w-[55%] flex flex-col items-start">
                    <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold text-white mb-6 md:mb-10 leading-tight">
                        You already have Artist Pro
                    </h1>
                    <p className="text-white text-sm md:text-base mb-8 md:mb-10">
                        You've unlocked access to the best of BeatZa for Artists. This is your all-in-one platform
                        to connect with fans and accelerate your career - including unlimited uploads, distribution to
                        60+ social networks and streaming platforms, and savings from 15+ exclusive partners.
                    </p>
                    <Link
                        href="/upload"
                        className="rounded-full bg-white px-6 py-3 md:px-7 md:py-3.5 font-semibold text-black transition-all duration-200 text-base md:text-lg hover:bg-black hover:text-white"
                    >
                        Upload Now
                    </Link>
                </div>

                {/* Right — avatar + info */}
                <div className="w-full md:w-[35%] flex flex-col items-center gap-6">
                    <ProfileImage
                        src={profileImgLink}
                        alt="Profile"
                        width={200}
                        height={200}
                        className="rounded-full w-36 h-36 md:w-50 md:h-50 object-cover"
                    />

                    <div className="flex flex-col items-start gap-2">
                        <p className="text-black text-xl md:text-3xl bg-white/50 px-3 py-2 w-full">
                            {fullName}
                        </p>
                        <div className="bg-white/50 px-3 py-1">
                            <p className="text-black text-sm md:text-base">
                                {city || 'No location'}
                            </p>
                        </div>
                        <div className="bg-white/50 inline-flex items-center gap-1.5 px-2 py-1">
                            <img src="/payment/pro-badge.svg" alt="Pro badge" className="w-3 h-3" />
                            <p className="text-black font-bold text-xs">ARTIST PRO</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}