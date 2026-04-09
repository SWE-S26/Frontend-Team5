"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import HeroBanner from "@/components/landing-page/HeroBanner"
import NavbarCenter from "@/components/layout/navbar/main-navbar/NavbarCenter"
import NeverStopListening from "@/components/landing-page/NeverStopListening"
import Button from "@/components/ui/Button"
import { useAppSelector } from "@/store/hooks"

export default function LandingPage() {
  const router = useRouter()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const hasHydrated = useAppSelector((state) => state.auth.hasHydrated)

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
      </div>
    </div>
  )
}