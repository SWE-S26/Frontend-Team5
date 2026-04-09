"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Button from "@/components/ui/Button"
import AuthModal from "@/components/auth/AuthModal";

const slides = [
  {
    image: "/hero-banner/placeholder1.jpeg",
    artist: "DC the Don",
    title: "SoundCloud Artist Pro",
    heading: ["Discover.", "Get Discovered."],
    description: "Discover your next obsession, or become someone else's. BeatZa is the only community where fans and artists come together to discover and connect through music.",
    buttons: [{ label: "Get Started", href: "/explore" }],
  },
  {
    image: "/hero-banner/placeholder2.jpeg",
    artist: "1900Rugrat",
    title: "Ascending Artist",
    heading: ["It all starts with", "an upload."],
    description: "From bedrooms and broom closets to studios and stadiums, BeatZa is where you define what's next in music. Just hit upload.",
    buttons: [{ label: "Upload", href: "/upload" }, { label: "Explore Artist Pro", href: "/artistpro" }],
  },
  {
    image: "/hero-banner/placeholder3.jpeg",
    artist: "Crayon",
    title: "Ascending Artist",
    heading: ["Where every music", "scene lives."],
    description: "Discover 400 million songs, remixes and DJ sets: every chart-topping track you can find elsewhere, and millions more you can't find anywhere else.",
    buttons: [{ label: "Upload", href: "/upload" }, { label: "Explore Go+", href: "/go" }],
  },
]

export default function HeroBanner() {
  const [current, setCurrent] = useState(0)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
    <div className="relative w-full rounded-2xl overflow-hidden h-111.5">

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
            <div className="absolute inset-0 bg-black/40" />

            {/* slide content — fixed layout so every slide aligns identically */}
            <div className="relative z-10 flex flex-col justify-between h-3/4 px-8 pt-22 pb-6">
              {/* heading + description — fixed block */}
              <div className="max-w-xl">
                <h1 className="text-white-smoke text-[60px] font-bold leading-tight">{slide.heading[0]}</h1>
                <h1 className="text-white-smoke text-[60px] font-bold leading-tight -mt-3">{slide.heading[1]}</h1>
                <p className="text-white-smoke text-[17px] font-bold mt-4">{slide.description}</p>
              </div>

              {/* buttons + artist credit — always on the same row at the bottom */}
              <div className="flex items-center gap-6 mt-8">
                <div className="flex gap-4">
                  {slide.buttons.map((btn, j) => (
                    <Link key={j} href={btn.label === "Get Started" ? "#" : btn.href}>
                      <Button
                        className={`px-3 py-1.5 text-[17px] cursor-pointer ${j === 0 ? "bg-white-smoke text-chinese-black" : "text-white-smoke hover:text-white-smoke"}`}
                        onClick={btn.label === "Get Started" ? () => setIsAuthModalOpen(true) : undefined}
                      >
                        {btn.label}
                      </Button>
                    </Link>
                  ))}
                </div>

                {/* artist credit — inline with buttons */}
                <div className="ml-auto text-left">
                  <p className="text-white-smoke font-bold text-sm">{slide.artist}</p>
                  <p className="text-white-smoke/70 text-xs">{slide.title}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* static top bar */}
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

      {/* static dots */}
      <div className="absolute bottom-5.5 left-1/2 -translate-x-1/2 z-20 flex gap-4">
        {slides.map((_, i) => (
          <button key={i} onClick={() => goToSlide(i)}
            className={`aspect-square h-4 rounded-full border-2 border-white-smoke transition-all duration-300
                        ${i === current ? "bg-white-smoke" : "bg-transparent"}`}
          />
        ))}
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  )
}