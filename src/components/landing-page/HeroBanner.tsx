"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Button from "@/components/ui/Button"
import AuthModal from "@/components/auth/AuthModal";

const slides = [
  {
    image: "/hero-banner/placeholder1.jpg",
    artist: "DC the Don",
    title: "SoundCloud Artist Pro",
    heading: ["Discover.", "Get Discovered."],
    description: "Discover your next obsession, or become someone else's. BeatZa is the only community where fans and artists come together to discover and connect through music.",
    buttons: [{ label: "Get Started", href: "/explore" }],
  },
  {
    image: "/hero-banner/placeholder2.jpg",
    artist: "1900Rugrat",
    title: "Ascending Artist",
    heading: ["It all starts with", "an upload."],
    description: "From bedrooms and broom closets to studios and stadiums, BeatZa is where you define what's next in music. Just hit upload.",
    buttons: [{ label: "Upload", href: "/upload" }, { label: "Explore Artist Pro", href: "/artistpro" }],
  },
  {
    image: "/hero-banner/placeholder3.jpg",
    artist: "Crayon",
    title: "Ascending Artist",
    heading: ["Where every music", "scene lives."],
    description: "Discover 400 million songs, remixes and DJ sets: every chart-topping track you can find elsewhere, and millions more you can't find anywhere else.",
    buttons: [{ label: "Upload", href: "/upload" }, { label: "Explore Go+", href: "/go" }],
  },
]

export default function HeroBanner() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  function goToSlide(index: number) {
    if (index === current) return
    setAnimating(true)
    setTimeout(() => {
      setCurrent(index)
      setAnimating(false)
    }, 300)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      goToSlide((current + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [current])

  return (
    <div className="relative w-full rounded-2xl overflow-hidden h-111.5">

      {/* background image with fade transition */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ backgroundImage: `url(${slides[current].image})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />

      {/* dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* static top bar — logo + buttons */}
      <div className="relative z-20 flex items-center justify-between px-8 pt-7">
        <div className="flex items-center">
          <img src="/app-logo/beatza.png" alt="BeatZa" className="w-12 mr-2 mt-1"/>
          <h1 className="text-white-smoke font-bold text-sm mt-1">CRAVING TUNES</h1>
        </div>
        <div className="flex gap-3">
          <Button data-testid="landing_sign_in" className="px-4 py-1.5 bg-white-smoke text-chinese-black text-[13px] cursor-pointer" onClick={() => setIsAuthModalOpen(true)}>
            Sign in
          </Button>
          <Button data-testid="landing_create_account" className="px-3 py-1.5 bg-chinese-black text-white-smoke text-[13px] cursor-pointer" onClick={() => setIsAuthModalOpen(true)}>
            Create account
          </Button>
          <Link data-testid="landing_for_artist" href="/sign-in" className="py-1.5 text-white-smoke font-bold text-[13px] transition-all duration-300 cursor-pointer">
            For Artists
          </Link>
        </div>
      </div>

      {/* animated content */}
      <div
        className={`relative z-10 flex flex-col h-3/4 p-8 transition-all duration-300 
                    ${animating ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"}`}
      >
        {/* headline */}
        <div className="max-w-xl">
          <h1 className="text-white-smoke text-[60px] font-bold leading-tight">{slides[current].heading[0]}</h1>
          <h1 className="text-white-smoke text-[60px] font-bold leading-tight -mt-3">{slides[current].heading[1]}</h1>
          <p className="text-white-smoke text-[17px] font-bold mt-4">
            {slides[current].description}
          </p>
        </div>

        <div className="flex gap-4 mt-12">
          {slides[current].buttons.map((btn, i) => (
            <Link key={i} href={btn.label === "Get Started" ? "#" : btn.href}>
              <Button
                className={`px-3 py-1.5 text-[17px] cursor-pointer ${i === 0 ? "bg-white-smoke text-chinese-black" : "text-white-smoke hover:text-white-smoke"}`}
                onClick={btn.label === "Get Started" ? () => setIsAuthModalOpen(true) : undefined}
              >
                {btn.label}
              </Button>
            </Link>
          ))}
        </div>

        {/* artist credit — animates with slide, fixed bottom right position */}
        <div className="absolute bottom-5 right-8 text-left">
          <p className="text-white-smoke font-bold text-sm">{slides[current].artist}</p>
          <p className="text-white-smoke/70 text-xs">{slides[current].title}</p>
        </div>
      </div>

      {/* static dots — never animates */}
      <div className="absolute bottom-5.5 left-1/2 -translate-x-1/2 z-20 flex gap-4">
        {slides.map((_, i) => (
          <button key={i} onClick={() => goToSlide(i)}
            className={`aspect-square h-4 rounded-full border-2 border-white-smoke transition-all duration-300
                        ${i === current ? "bg-white-smoke" : "bg-transparent"}`}
          />
        ))}
      </div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  )
}