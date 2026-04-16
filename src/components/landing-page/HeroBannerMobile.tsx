"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Button from "@/components/ui/Button"
import AuthModal from "@/components/auth/AuthModal"

const slides = [
  {
    image: "/landing-page/hero-banner/placeholder1.jpeg",
    artist: "DC the Don",
    title: "SoundCloud Artist Pro",
    heading: ["Discover.", "Get Discovered."],
    description: "Discover your next obsession, or become someone else's.",
    buttons: [{ label: "Get Started", href: "/explore" }],
  },
  {
    image: "/landing-page/hero-banner/placeholder2.jpeg",
    artist: "1900Rugrat",
    title: "Ascending Artist",
    heading: ["It all starts with", "an upload."],
    description: "BeatZa is where you define what's next in music. Just hit upload.",
    buttons: [{ label: "Upload", href: "/upload" }, { label: "Artist Pro", href: "/artistpro" }],
  },
  {
    image: "/landing-page/hero-banner/placeholder3.jpeg",
    artist: "Crayon",
    title: "Ascending Artist",
    heading: ["Where every music", "scene lives."],
    description: "Discover 400 million songs, remixes and DJ sets.",
    buttons: [{ label: "Upload", href: "/upload" }, { label: "Go+", href: "/go" }],
  },
]

export default function HeroBannerMobile() {
  const [current, setCurrent] = useState(0)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full overflow-hidden h-135">

      {/* Sliding track */}
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
            {/* Gradient overlay — stronger at bottom for text legibility */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
          </div>
        ))}
      </div>

      {/* Top bar — static above slides */}
      <div className="relative z-20 flex items-center justify-between px-4 pt-5">
        <img src="/app-logo/beatza.png" alt="BeatZa" className="w-9 mt-0.5" />
        <div className="flex gap-2">
          <Button
            className="px-3 py-1 bg-white-smoke text-chinese-black text-[12px] cursor-pointer"
            onClick={() => setIsAuthModalOpen(true)}
          >
            Sign in
          </Button>
          <Button
            className="px-3 py-1 bg-chinese-black text-white-smoke text-[12px] cursor-pointer border border-white-smoke/30"
            onClick={() => setIsAuthModalOpen(true)}
          >
            Create account
          </Button>
        </div>
      </div>

      {/* Bottom content — static, reads from current slide */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-5 pb-5">
        {/* Heading */}
        <h1 className="text-white-smoke text-[38px] font-bold leading-tight">
          {slides[current].heading[0]}
        </h1>
        <h1 className="text-white-smoke text-[38px] font-bold leading-tight -mt-1">
          {slides[current].heading[1]}
        </h1>

        {/* Description */}
        <p className="text-white-smoke/90 text-[13px] font-semibold mt-2 leading-relaxed">
          {slides[current].description}
        </p>

        {/* Buttons row + artist credit */}
        <div className="flex items-center gap-3 mt-4">
          {slides[current].buttons.map((btn, j) => (
            <Link key={j} href={btn.label === "Get Started" ? "#" : btn.href}>
              <Button
                className={`px-4 py-1.5 text-[14px] cursor-pointer ${
                  j === 0
                    ? "bg-white-smoke text-chinese-black"
                    : "text-white-smoke border border-white-smoke/60"
                }`}
                onClick={btn.label === "Get Started" ? () => setIsAuthModalOpen(true) : undefined}
              >
                {btn.label}
              </Button>
            </Link>
          ))}

          <div className="ml-auto text-right">
            <p className="text-white-smoke font-bold text-xs">{slides[current].artist}</p>
            <p className="text-white-smoke/60 text-[10px]">{slides[current].title}</p>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 mt-4">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-3 aspect-square rounded-full border-2 border-white-smoke transition-all duration-300 ${
                i === current ? "bg-white-smoke" : "bg-transparent"
              }`}
            />
          ))}
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  )
}