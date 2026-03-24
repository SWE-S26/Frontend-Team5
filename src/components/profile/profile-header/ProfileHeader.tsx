"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import ColorThief from "color-thief-browser"

import Button from "@/components/ui/Button"
import AvatarUpload from "./AvatarUpload"
import CoverPhotoUpload from "./CoverPhotoUpload"
import { useGetProfile } from "@/hooks/useProfile"
import { authStore, useAuthStore } from "@/store/authStore"

export default function ProfileHeader() {
  const params = useParams()
  const rawUserId = params.username as string
  const userId = rawUserId && rawUserId !== "null" && rawUserId !== "undefined" ? rawUserId : ""
  const { userId: authUserId, profileImgLink, bannerImgLink, displayName, hasHydrated } = useAuthStore()
  const shouldFetchProfile = Boolean(userId && authUserId && authUserId !== userId)

  const { getProfile, loading, error, profile } = useGetProfile()

  const [coverImage,  setCoverImage]  = useState<string | null>(null)
  const [avatarImage, setAvatarImage] = useState<string | null>(profileImgLink)
  const [gradient,    setGradient]    = useState("linear-gradient(to right, #c3adb4, #8f6f79)")

  useEffect(() => {
    if (!hasHydrated) return
    if (!shouldFetchProfile) return
    getProfile(userId)
  }, [userId, hasHydrated, shouldFetchProfile, getProfile])

  useEffect(() => {
    if (!hasHydrated) return
    if (bannerImgLink) {
      setCoverImage(bannerImgLink)
    }
  }, [hasHydrated, bannerImgLink])

  useEffect(() => {
    if (!profile) return
    if (profile.profileImgLink) {
      setAvatarImage(profile.profileImgLink)
      authStore.setProfileImg(profile.profileImgLink)
    }
    if (profile.bannerImgLink) {
      setCoverImage(profile.bannerImgLink)
      authStore.setBannerImg(profile.bannerImgLink)
    }
  }, [profile])

  useEffect(() => {
    if (!profileImgLink) return
    setAvatarImage((prev) => prev || profileImgLink)
  }, [profileImgLink])

  useEffect(() => {
    if (!avatarImage) return
    authStore.setProfileImg(avatarImage)
  }, [avatarImage])

  useEffect(() => {
    authStore.setBannerImg(avatarImage)
  }, [avatarImage])

  useEffect(() => {
    if (!avatarImage) return

    const img = new Image()
    img.crossOrigin = "Anonymous"
    img.src = avatarImage

    img.onload = () => {
      const colorThief = new ColorThief()
      const palette = colorThief.getPalette(img, 2)
      const c1 = `rgb(${palette[0].join(",")})`
      const c2 = `rgb(${palette[1].join(",")})`
      setGradient(`linear-gradient(to right, ${c1}, ${c2})`)
    }
  }, [avatarImage])

  if (loading && shouldFetchProfile) return (
    <div className="relative w-full h-80 -mt-12.5 bg-off-black animate-pulse" />
  )

  if (error && shouldFetchProfile) return (
    <div className="relative w-full h-80 -mt-12.5 bg-off-black flex items-center justify-center">
      <p className="text-red-400 text-sm">{error}</p>
    </div>
  )

  return (
    <div
      className="relative w-full h-80 group -mt-12.5"
      style={
        coverImage
          ? { backgroundImage: `url(${coverImage})`, backgroundSize: "cover", backgroundPosition: "center" }
          : { background: gradient }
      }
    >
      <div className="absolute top-8 right-6 flex flex-col gap-3">
        <CoverPhotoUpload onImageChange={setCoverImage}>
          <Button className="bg-chinese-black text-white-smoke cursor-pointer">
            Upload header image
          </Button>
        </CoverPhotoUpload>
      </div>

      <div className="absolute left-10 top-1/2 -translate-y-1/2 group/avatar">
        <AvatarUpload
          avatarImage={avatarImage}
          onImageChange={setAvatarImage}
          className="relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gray-400/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
          <Button
            className={`bg-chinese-black text-white-smoke absolute bottom-9 right-9 cursor-pointer 
              ${avatarImage ? "opacity-0 group-hover/avatar:opacity-100" : "opacity-100"}`}
          >
            Upload image
          </Button>
        </AvatarUpload>
      </div>

      <div className="absolute left-72 bottom-20 -translate-y-1/2">
        <div className="flex flex-col items-start">
          <h1 className="text-3xl font-bold text-white bg-black px-3 py-2">
            {displayName || profile?.displayName || "No Name"}
          </h1>
          <p className="text-silver font-bold bg-black px-3 py-2">
            {profile?.firstName && profile?.lastName
              ? `${profile.firstName} ${profile.lastName}`
              : displayName || profile?.displayName || "No Name"}
          </p>
        </div>
        <div className="bg-black inline-block px-3 py-1 absolute -bottom-10">
          <p className="text-silver font-bold">
            {profile?.city && profile?.country
              ? `${profile.city}, ${profile.country}`
              : "No location"}
          </p>
        </div>
      </div>
    </div>
  )
}