"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
    buttons: [{ label: "Upload", href: "/upload" }, { label: "Artist Pro", href: "/artist" }],
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
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authRedirect, setAuthRedirect] = useState("/home")

  const openAuth = (redirectTo: string) => {
    setAuthRedirect(redirectTo)
    setIsAuthModalOpen(true)
  }

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
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
          </div>
        ))}
      </div>

      {/* Top bar */}
      <div className="relative z-20 flex items-center justify-between px-4 pt-5">
        <img src="/app-logo/beatza.png" alt="BeatZa" className="w-9 mt-0.5" />
        <div className="flex gap-2">
          <Button
            className="px-3 py-1 bg-white text-black text-[12px] cursor-pointer"
            onClick={() => openAuth("/home")}
          >
            Sign in
          </Button>
          <Button
            className="px-3 py-1 bg-black text-white text-[12px] cursor-pointer border border-white/30"
            onClick={() => openAuth("/home")}
          >
            Create account
          </Button>
        </div>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-5 pb-5">
        <h1 className="text-white text-[38px] font-bold leading-tight">
          {slides[current].heading[0]}
        </h1>
        <h1 className="text-white text-[38px] font-bold leading-tight -mt-1">
          {slides[current].heading[1]}
        </h1>

        <p className="text-white/90 text-[13px] font-semibold mt-2 leading-relaxed">
          {slides[current].description}
        </p>

        <div className="flex items-center gap-3 mt-4">
          {slides[current].buttons.map((btn, j) => (
            <Button
              key={j}
              className={`px-4 py-1.5 text-[14px] cursor-pointer ${
                j === 0
                  ? "bg-white text-black"
                  : "text-white border border-white/60"
              }`}
              onClick={() => {
                if (btn.label === "Go+") {
                  router.push("/goplus")
                  return
                }
                openAuth(btn.label === "Upload" ? "/upload" : "/home")
              }}
            >
              {btn.label}
            </Button>
          ))}

          <div className="ml-auto text-right">
            <p className="text-white font-bold text-xs">{slides[current].artist}</p>
            <p className="text-white/60 text-[10px]">{slides[current].title}</p>
          </div>
        </div>

        <div className="flex justify-center gap-3 mt-4">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-3 aspect-square rounded-full border-2 border-white transition-all duration-300 ${
                i === current ? "bg-white" : "bg-transparent"
              }`}
            />
          ))}
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} redirectTo={authRedirect} />
    </div>
  )
}