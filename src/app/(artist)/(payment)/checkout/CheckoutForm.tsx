'use client'

import { useState, useEffect } from 'react'
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { useLogout, useRefreshToken } from '@/hooks/useAuth'
import { usePaymentPlans, useCheckout } from '@/hooks/usePayment'
import CB from '@/components/settings/CB'
import { IoIosArrowDown } from 'react-icons/io'
import { FaLock } from 'react-icons/fa'
import FloatingInput from '@/components/payment/FloatingInput'
import { COUNTRIES } from '@/components/payment/countries'
import { useGetProfile } from '@/hooks/useProfile'
import { setProfile, clearProfile } from '@/store/slices/profileSlice'

// ── Constants ────────────────────────────────────────────────────

const CURRENCY = '$'

const STRIPE_ELEMENT_STYLE = {
    style: {
        base: {
            fontSize: '14px',
            color: '#374151',
            '::placeholder': { color: '#9CA3AF' },
        },
        invalid: { color: '#EF4444' },
    },
}

type BillingInterval = 'monthly' | 'yearly'

// ── Component ────────────────────────────────────────────────────

export function CheckoutForm() {
const stripe = useStripe()
    const elements = useElements()
    const router = useRouter()

    const searchParams = useSearchParams()
    const intervalParam = searchParams.get('interval') as BillingInterval | null

    // ── Auth state ───────────────────────────────────────────────
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
    const profileImgLink  = useAppSelector((state) => state.auth.profileImgLink)
    const displayName     = useAppSelector((state) => state.auth.displayName)
    const userId          = useAppSelector((state) => state.auth.userId)
    const hasHydrated     = useAppSelector((state) => state.auth.hasHydrated)

    // ── Profile state ────────────────────────────────────────────
    const dispatch      = useAppDispatch()
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

    // ── Hooks ────────────────────────────────────────────────────
    const { logout }                                                   = useLogout()
    const { refreshToken }                                             = useRefreshToken()
    const { plans, loading: plansLoading }                             = usePaymentPlans()
    const { checkout, loading: checkoutLoading, error: checkoutError } = useCheckout()

    // ── UI state ─────────────────────────────────────────────────
    const [isDropdownOpen,    setIsDropdownOpen]    = useState(false)
    const [selectedInterval,  setSelectedInterval]  = useState<BillingInterval>(intervalParam || 'yearly')
    const [showCoupon,        setShowCoupon]        = useState(false)
    const [couponCode,        setCouponCode]        = useState('')
    const [showBillingAddress, setShowBillingAddress] = useState(false)

    // ── Form state ───────────────────────────────────────────────
    const [cardHolderFirstName, setCardHolderFirstName] = useState('')
    const [cardHolderSurname,   setCardHolderSurname]   = useState('')
    const [stripeError,         setStripeError]         = useState<string | null>(null)

    // ── Stripe field error/touched state ─────────────────────────
    const [cardNumberError,   setCardNumberError]   = useState<string | null>(null)
    const [cardExpiryError,   setCardExpiryError]   = useState<string | null>(null)
    const [cardCvcError,      setCardCvcError]      = useState<string | null>(null)
    const [cardNumberTouched, setCardNumberTouched] = useState(false)
    const [cardExpiryTouched, setCardExpiryTouched] = useState(false)
    const [cardCvcTouched,    setCardCvcTouched]    = useState(false)
    const [cardBrand,         setCardBrand]         = useState<string | null>(null)

    // ── Derived values ───────────────────────────────────────────
    const selectedPlan  = selectedInterval === 'yearly' ? plans?.pro_yearly : plans?.pro_monthly
    const totalPrice    = selectedPlan?.amount ?? 0
    const yearlyMonthly = plans ? (plans.pro_yearly.amount / 12).toFixed(2) : '...'
    const savings       = plans
        ? Math.round((plans.pro_monthly.amount * 12 - plans.pro_yearly.amount) / (plans.pro_monthly.amount * 12) * 100)
        : 0
    const headerName  = profileFirstName || profileLastName
        ? `${profileFirstName || ''} ${profileLastName || ''}`.trim()
        : displayName
    const isFormValid = cardHolderFirstName.trim() !== '' && cardHolderSurname.trim() !== ''

    // ── Handlers ─────────────────────────────────────────────────
    const handleSignOut = () => {
        setIsDropdownOpen(false)
        logout()
    }

    const handleBuySubscription = async () => {
        if (!stripe || !elements || !selectedPlan) return

        setStripeError(null)
        setCardNumberTouched(true)
        setCardExpiryTouched(true)
        setCardCvcTouched(true)

        if (cardNumberError || cardExpiryError || cardCvcError) return

        const cardElement = elements.getElement(CardNumberElement)
        if (!cardElement) return

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        })

        if (error) {
            setStripeError(error.message ?? 'Card error')
            return
        }

        const success = await checkout(paymentMethod.id, selectedPlan.priceId)
        if (success) {
            await refreshToken()
            router.push(`/success?plan=${selectedInterval}&price=${totalPrice}&currency=${CURRENCY}&from=checkout`)
        }
    }

    // ── Render ───────────────────────────────────────────────────
    return (
        <div className="w-full min-h-screen bg-white">

            {/* Header */}
            <div className="flex justify-center bg-[#333333] fixed top-0 z-1000 w-full">
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
                                        <h1 className="text-white-smoke font-bold text-[14px] mr-2 hover:opacity-80 transition-opacity truncate max-w-33">
                                            {headerName}
                                        </h1>
                                    </div>
                                    <IoIosArrowDown />
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

            {/* Content */}
            <div className="flex justify-center px-4 sm:px-6 pb-12 pt-20 sm:pt-25">
                <div className="w-full max-w-237">

                    <h1 className="text-2xl sm:text-3xl font-bold text-black mb-8 sm:mb-10">Get Artist Pro</h1>

                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 justify-center">

                        {/* Left Column */}
                        <div className="w-full lg:w-md space-y-8 sm:space-y-10">

                            {/* 1. Billing Cycle */}
                            <div>
                                <h2 className="text-lg sm:text-xl font-bold text-black mb-4 sm:mb-6">1. Billing cycle</h2>
                                <div className="space-y-3">

                                    {/* Yearly */}
                                    <button
                                        onClick={() => setSelectedInterval('yearly')}
                                        className={`w-full flex items-center justify-between p-4 border-2 rounded-lg text-left transition-all ${
                                            selectedInterval === 'yearly' ? 'border-orange-500' : 'border-[#666666]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                                selectedInterval === 'yearly' ? 'border-orange-500' : 'border-[#666666]'
                                            }`}>
                                                {selectedInterval === 'yearly' && (
                                                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-black text-sm sm:text-base">Yearly billing</p>
                                                <p className="text-xs sm:text-sm text-gray-500">
                                                    {plansLoading ? '...' : `${CURRENCY} ${plans?.pro_yearly.amount.toFixed(2)}, that's ${CURRENCY} ${yearlyMonthly}/month`}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`text-white text-[10px] font-bold px-1 py-px rounded-[3px] shrink-0 ml-2 ${selectedInterval === 'yearly' ? 'bg-red-600' : 'bg-[#666666]'}`}>
                                            {savings}% YEARLY DISCOUNT
                                        </span>
                                    </button>

                                    {/* Monthly */}
                                    <button
                                        onClick={() => setSelectedInterval('monthly')}
                                        className={`w-full flex items-center justify-between p-4 border-2 rounded-lg text-left transition-all ${
                                            selectedInterval === 'monthly' ? 'border-orange-500' : 'border-[#666666]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                                selectedInterval === 'monthly' ? 'border-orange-500' : 'border-[#666666]'
                                            }`}>
                                                {selectedInterval === 'monthly' && (
                                                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-black text-sm sm:text-base">Monthly billing</p>
                                                <p className="text-xs sm:text-sm text-gray-500">
                                                    {plansLoading ? '...' : `${CURRENCY} ${plans?.pro_monthly.amount}/month`}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* 2. Payment Details */}
                            <div>
                                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                                    <h2 className="text-lg sm:text-xl font-bold text-black">2. Payment details</h2>
                                    <FaLock className="text-gray-400 text-sm" />
                                </div>

                                <div className="space-y-3">
                                    <FloatingInput
                                        placeholder="First name"
                                        value={cardHolderFirstName}
                                        onChange={(e) => setCardHolderFirstName(e.target.value)}
                                        required
                                        errorMessage="Enter a first name"
                                    />
                                    <FloatingInput
                                        placeholder="Surname"
                                        value={cardHolderSurname}
                                        onChange={(e) => setCardHolderSurname(e.target.value)}
                                        required
                                        errorMessage="Enter a surname"
                                    />

                                    {/* Card number */}
                                    <div>
                                        <div className={`bg-gray-100 rounded-lg px-4 py-4 border-2 transition-colors ${
                                            cardNumberTouched && cardNumberError ? 'border-red-500' : 'border-transparent focus-within:border-black'
                                        }`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <p className={`text-[10px] ${cardNumberTouched && cardNumberError ? 'text-red-400' : 'text-gray-400'}`}>
                                                    Card number
                                                </p>
                                                {cardBrand && cardBrand !== 'unknown' && (
                                                    <img src={`/payment/${cardBrand}.svg`} alt={cardBrand} className="h-5" />
                                                )}
                                            </div>
                                            <CardNumberElement
                                                onChange={(e) => {
                                                    setCardNumberTouched(true)
                                                    setCardNumberError(e.error?.message ?? null)
                                                    setCardBrand(e.brand ?? null)
                                                }}
                                                options={STRIPE_ELEMENT_STYLE}
                                            />
                                        </div>
                                        {cardNumberTouched && cardNumberError && (
                                            <p className="text-red-500 text-xs mt-1 ml-1">{cardNumberError}</p>
                                        )}
                                    </div>

                                    {/* Expiry + CVV */}
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="col-span-2">
                                            <div className={`bg-gray-100 rounded-lg px-4 py-4 border-2 transition-colors ${
                                                cardExpiryTouched && cardExpiryError ? 'border-red-500' : 'border-transparent focus-within:border-black'
                                            }`}>
                                                <p className={`text-[10px] mb-2 ${cardExpiryTouched && cardExpiryError ? 'text-red-400' : 'text-gray-400'}`}>
                                                    Expiration date
                                                </p>
                                                <CardExpiryElement
                                                    onChange={(e) => {
                                                        setCardExpiryTouched(true)
                                                        setCardExpiryError(e.error?.message ?? null)
                                                    }}
                                                    options={STRIPE_ELEMENT_STYLE}
                                                />
                                            </div>
                                            {cardExpiryTouched && cardExpiryError && (
                                                <p className="text-red-500 text-xs mt-1 ml-1">{cardExpiryError}</p>
                                            )}
                                        </div>

                                        <div>
                                            <div className={`bg-gray-100 rounded-lg px-4 py-4 border-2 transition-colors ${
                                                cardCvcTouched && cardCvcError ? 'border-red-500' : 'border-transparent focus-within:border-black'
                                            }`}>
                                                <p className={`text-[10px] mb-2 ${cardCvcTouched && cardCvcError ? 'text-red-400' : 'text-gray-400'}`}>
                                                    CVV
                                                </p>
                                                <CardCvcElement
                                                    onChange={(e) => {
                                                        setCardCvcTouched(true)
                                                        setCardCvcError(e.error?.message ?? null)
                                                    }}
                                                    options={STRIPE_ELEMENT_STYLE}
                                                />
                                            </div>
                                            {cardCvcTouched && cardCvcError && (
                                                <p className="text-red-500 text-xs mt-1 ml-1">{cardCvcError}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Billing Country */}
                                    <div className="relative">
                                        <select className="w-full bg-gray-100 rounded-lg px-4 pt-5 pb-2 text-sm text-gray-700 outline-none appearance-none">
                                            {COUNTRIES.map((country) => (
                                                <option key={country.value} value={country.value}>{country.label}</option>
                                            ))}
                                        </select>
                                        <p className="absolute left-4 top-1.5 text-[10px] text-gray-400">Billing Country</p>
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▾</span>
                                    </div>

                                    <FloatingInput placeholder="Postcode (optional)" />

                                    {/* Billing address */}
                                    <div className="flex items-center gap-2 pt-1">
                                        <CB
                                            checked={showBillingAddress}
                                            onChange={setShowBillingAddress}
                                            uncheckedClassName="border-gray-400"
                                            checkStroke="black"
                                        />
                                        <span className="text-sm font-medium text-black">Add billing address (visible on invoice)</span>
                                    </div>

                                    {showBillingAddress && (
                                        <div className="space-y-3">
                                            <FloatingInput placeholder="Full name (optional)" />
                                            <FloatingInput placeholder="Company (optional)" />
                                            <FloatingInput placeholder="Street Address (optional)" />
                                            <FloatingInput placeholder="City (optional)" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Review Purchase */}
                        <div className="w-full lg:w-md">
                            <h2 className="text-lg sm:text-xl font-bold text-black mb-4 sm:mb-6">3. Review your purchase</h2>

                            <div className="flex items-center gap-3 mb-4">
                                <img src="/app-logo/blacklogo.png" alt="BeatZa" className="w-16 h-12 sm:w-20 sm:h-15" />
                                <span className="text-base sm:text-lg font-bold text-black">Artist Pro</span>
                            </div>

                            <button
                                onClick={() => setShowCoupon(!showCoupon)}
                                className="text-orange-500 text-sm hover:underline mb-4 block"
                            >
                                Do you have a coupon code?
                            </button>

                            {showCoupon && (
                                <div className="flex gap-2 mb-6">
                                    <FloatingInput
                                        placeholder="Enter coupon code"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        className="flex-1"
                                    />
                                    <button className="bg-black text-white px-5 py-2 rounded-full font-semibold text-sm hover:bg-gray-800">
                                        Apply
                                    </button>
                                </div>
                            )}

                            {/* Order summary */}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6 mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="font-bold text-black">Total</span>
                                    <span className="font-bold text-black text-lg">
                                        {plansLoading ? '...' : `${CURRENCY} ${totalPrice.toFixed(2)}`}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center mb-6">
                                    <span className="font-semibold text-black text-sm">Billing cycle</span>
                                    <span className="text-sm text-black capitalize">{selectedInterval}</span>
                                </div>

                                <p className="text-xs text-gray-500 mb-4">
                                    Subscription will automatically renew at {CURRENCY} {totalPrice.toFixed(2)} every {selectedInterval === 'yearly' ? 'year' : 'month'}, unless you cancel before the day of your next renewal in your subscription settings.
                                </p>

                                <p className="text-xs text-gray-400">All prices in {CURRENCY}</p>
                            </div>

                            {stripeError && (
                                <p className="text-red-500 text-sm mb-3">{stripeError}</p>
                            )}

                            {checkoutError && (
                                <p className="text-red-500 text-sm mb-3">{checkoutError}</p>
                            )}

                            <button
                                onClick={handleBuySubscription}
                                disabled={!stripe || checkoutLoading || plansLoading || !isFormValid}
                                className="w-full py-3 rounded-lg font-semibold text-white transition-all bg-gray-500 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {checkoutLoading ? 'Processing...' : 'Buy subscription'}
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
            <div className="pb-10 bg-white w-full max-w-291 flex flex-col mx-auto px-4 sm:px-0">
                {isAuthenticated && (
                    <p className="text-xs text-gray-600 mb-1">
                        Signed in as {displayName}.
                        <button onClick={handleSignOut} className="ml-1 text-gray-600 underline hover:text-black">
                            Sign out
                        </button>
                    </p>
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