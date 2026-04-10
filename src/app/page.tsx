"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import HeroBanner from "@/components/landing-page/HeroBanner"
import NavbarCenter from "@/components/layout/navbar/main-navbar/NavbarCenter"
import NeverStopListening from "@/components/landing-page/NeverStopListening"
import CallingAllCreators from "@/components/landing-page/CallingAllCreators"
import AuthModal from "@/components/auth/AuthModal";
import Button from "@/components/ui/Button"
import { useAppSelector } from "@/store/hooks"

export default function LandingPage() {
  const router = useRouter()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const hasHydrated = useAppSelector((state) => state.auth.hasHydrated)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (!hasHydrated) return
    if (isAuthenticated) router.replace("/home")
  }, [hasHydrated, isAuthenticated, router])

  if (!hasHydrated || isAuthenticated) {
    return <div className="my-20" />
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-310 mt-9">
        <HeroBanner />
        <div className="flex gap-3 items-center justify-center mt-14">
          <div className="w-[49%]">
            <NavbarCenter />
          </div>
          <h1 className="font-bold">or</h1>
          <Button className="px-3 py-1.5 text-[17px] cursor-pointer bg-white-smoke text-chinese-black">
            Upload Your Own
          </Button>
        </div>

        <div className="flex flex-col gap-5 items-center justify-center mt-9">
          <h1 className="font-bold text-xl">
            Hear what's trending for free in the SoundCloud community
          </h1>
          <Link href="/home">
            <Button className="px-3 py-1.5 text-[17px] cursor-pointer bg-white-smoke text-chinese-black">
              Explore Trending Playlists
            </Button>
          </Link>
        </div>

        <div className="my-20" />

        <NeverStopListening />
        <CallingAllCreators />

        <div className="flex flex-col items-center gap-4 py-16">
          <h2 className="text-white text-4xl leading-tight text-center">
            Thanks for listening. Now join in.
          </h2>

          <p className="text-white font-bold text-[15px] text-center">
            Save tracks, follow artists and build playlists. All for free.
          </p>

          <Button
            className="bg-white text-black mt-2 px-12 py-3 text-[17px]!"
            onClick={() => setIsAuthModalOpen(true)}
          >
            Create account
          </Button>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-white text-sm">Already have an account?</span>
            <Button
              className="text-white"
              onClick={() => setIsAuthModalOpen(true)}
            >
              Sign in
            </Button>
          </div>
        </div>

      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  )
}