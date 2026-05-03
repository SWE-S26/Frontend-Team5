"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Button from "@/components/ui/Button"
import AuthModal from "@/components/auth/AuthModal";

const slides = [
  {
    image: "/landing-page/hero-banner/placeholder1.jpeg",
    artist: "DC the Don",
    title: "SoundCloud Artist Pro",
    heading: ["Discover.", "Get Discovered."],
    description: "Discover your next obsession, or become someone else's. BeatZa is the only community where fans and artists come together to discover and connect through music.",
    buttons: [{ label: "Get Started", href: "/explore" }],
  },
  {
    image: "/landing-page/hero-banner/placeholder2.jpeg",
    artist: "1900Rugrat",
    title: "Ascending Artist",
    heading: ["It all starts with", "an upload."],
    description: "From bedrooms and broom closets to studios and stadiums, BeatZa is where you define what's next in music. Just hit upload.",
    buttons: [{ label: "Upload", href: "/upload" }, { label: "Explore Artist Pro", href: "/artist" }],
  },
  {
    image: "/landing-page/hero-banner/placeholder3.jpeg",
    artist: "Crayon",
    title: "Ascending Artist",
    heading: ["Where every music", "scene lives."],
    description: "Discover 400 million songs, remixes and DJ sets: every chart-topping track you can find elsewhere, and millions more you can't find anywhere else.",
    buttons: [{ label: "Upload", href: "/upload" }, { label: "Explore Go+", href: "/goplus" }],
  },
]

export default function HeroBanner() {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authRedirect, setAuthRedirect] = useState("/home")

  const openAuth = (redirectTo: string) => {
    setAuthRedirect(redirectTo)
    setIsAuthModalOpen(true)
  }

  function goToSlide(index: number) {
    if (index === current) return
    setCurrent(index)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full rounded-2xl overflow-hidden h-105 sm:h-111.5">

      {/* sliding track */}
      <div
        className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="relative w-full h-full shrink-0"
            style={{ backgroundImage: `url(${slide.image})`, backgroundSize: "cover", backgroundPosition: "center" }}
          >
            <div className="absolute inset-0 bg-black/10" />

            {/* slide content */}
            <div className="relative z-10 flex flex-col justify-between h-3/4 px-4 sm:px-8 pt-16 sm:pt-22 pb-6">
              <div className="max-w-xl">
                <h1 className="text-white text-[32px] sm:text-[60px] font-bold leading-tight">{slide.heading[0]}</h1>
                <h1 className="text-white text-[32px] sm:text-[60px] font-bold leading-tight -mt-1 sm:-mt-3">{slide.heading[1]}</h1>
                <p className="text-white text-[13px] sm:text-[17px] font-bold mt-3 sm:mt-4 line-clamp-3 sm:line-clamp-none">{slide.description}</p>
              </div>

              <div className="flex items-center gap-4 sm:gap-6 mt-6 sm:mt-8">
                <div className="flex gap-2 sm:gap-4">
                  {slide.buttons.map((btn, j) => (
                    <Button
                      key={j}
                      className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-[13px] sm:text-[17px] cursor-pointer ${j === 0 ? "bg-white text-black" : "text-white hover:text-white"}`}
                      onClick={() => {
                        if (btn.label === "Explore Go+") {
                          router.push("/goplus")
                          return
                        }
                        openAuth(btn.label === "Upload" ? "/upload" : "/home")
                      }}
                    >
                      {btn.label}
                    </Button>
                  ))}
                </div>

                <div className="ml-auto text-left">
                  <p className="text-white font-bold text-xs sm:text-sm">{slide.artist}</p>
                  <p className="text-white/70 text-[10px] sm:text-xs">{slide.title}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* static top bar */}
      <div className="relative z-20 flex items-center justify-between px-4 sm:px-8 pt-4 sm:pt-7">
        <div className="flex items-center">
          <img src="/app-logo/beatza.png" alt="BeatZa" className="w-8 sm:w-12 mr-1.5 sm:mr-2 mt-1"/>
          <h1 className="text-white font-bold text-xs sm:text-sm mt-1 hidden sm:block">CRAVING TUNES</h1>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <Button
            data-testid="landing_sign_in"
            className="px-2.5 sm:px-4 py-1 sm:py-1.5 bg-white text-black text-[11px] sm:text-[13px] cursor-pointer"
            onClick={() => openAuth("/home")}
          >
            Sign in
          </Button>
          <Button
            data-testid="landing_create_account"
            className="px-2 sm:px-3 py-1 sm:py-1.5 bg-black text-white text-[11px] sm:text-[13px] cursor-pointer"
            onClick={() => openAuth("/home")}
          >
            Create account
          </Button>
          <Link
            data-testid="landing_for_artist"
            href="/sign-in"
            className="py-1 sm:py-1.5 text-white font-bold text-[11px] sm:text-[13px] transition-all duration-300 cursor-pointer hidden sm:block"
          >
            For Artists
          </Link>
        </div>
      </div>

      {/* static dots */}
      <div className="absolute bottom-5.5 left-1/2 -translate-x-1/2 z-20 flex gap-3 sm:gap-4">
        {slides.map((_, i) => (
          <button key={i} onClick={() => goToSlide(i)}
            className={`aspect-square h-3 sm:h-4 rounded-full border-2 border-white transition-all duration-300
                        ${i === current ? "bg-white" : "bg-transparent"}`}
          />
        ))}
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} redirectTo={authRedirect} />
    </div>
  )
}