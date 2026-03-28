"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import ColorThief from "color-thief-browser"

import Button from "@/components/ui/Button"
import AvatarUpload from "./AvatarUpload"
import CoverPhotoUpload from "./CoverPhotoUpload"
import { useGetProfile } from "@/hooks/useProfile"
import { useUpdateProfile } from "@/hooks/useUpdateProfile"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { setProfileImgLink, setBannerImgLink } from "@/store/slices/authSlice"
import { setProfile, clearProfile } from "@/store/slices/profileSlice"

export default function ProfileHeader() {
  const dispatch   = useAppDispatch()
  const params     = useParams()
  const rawUserId  = params.username as string
  const userId     = rawUserId && rawUserId !== "null" && rawUserId !== "undefined" ? rawUserId : ""

  const authUserId  = useAppSelector((state) => state.auth.userId)
  const hasHydrated = useAppSelector((state) => state.auth.hasHydrated)

  const profileImgLink = useAppSelector((state) => state.profile.profileImgLink)
  const bannerImgLink  = useAppSelector((state) => state.profile.bannerImgLink)
  const displayName    = useAppSelector((state) => state.profile.displayName)
  const firstName      = useAppSelector((state) => state.profile.firstName)
  const lastName       = useAppSelector((state) => state.profile.lastName)
  const city           = useAppSelector((state) => state.profile.city)
  const country        = useAppSelector((state) => state.profile.country)

  const { getProfile, loading, error } = useGetProfile()
  const { updateProfile } = useUpdateProfile()

  const [coverImage,  setCoverImage]  = useState<string | null>(null)
  const [avatarImage, setAvatarImage] = useState<string | null>(null)
  const [gradient,    setGradient]    = useState("linear-gradient(to right, #c3adb4, #8f6f79)")
  const isOwnProfile = useAppSelector((state) => state.profile.isOwnProfile)
  useEffect(() => {
    if (!hasHydrated || !userId) return

    dispatch(setProfile({ isLoading: true }))
    getProfile(userId).then((data) => {
      if (!data) return
      dispatch(setProfile({
        userId:         data.userId,
        displayName:    data.displayName,
        firstName:      data.firstName,
        lastName:       data.lastName,
        bio:            data.bio,
        profileLink:    data.profileLink,
        profileImgLink: data.profileImgLink,
        bannerImgLink:  data.bannerImgLink,
        city:           data.city,
        country:        data.country,
        links:          data.links,
        supportLink:    data.supportLink,
        favoriteGenres: data.favoriteGenres,
        followersCount: data.followersCount,
        followedCount:  data.followedCount,
        tracksCount:    data.trackCount,
        isOwnProfile:   data.userId === authUserId,
        isLoading:    false, 
      }))
    })

    return () => { dispatch(clearProfile()) }
  }, [userId, hasHydrated])

  // sync local image state from profileSlice
  useEffect(() => {
    if (bannerImgLink) setCoverImage(bannerImgLink)
  }, [bannerImgLink])

  useEffect(() => {
    if (profileImgLink) setAvatarImage(profileImgLink)
  }, [profileImgLink])

  // generate gradient from avatar color
  useEffect(() => {
    if (!avatarImage) return

    const img = new Image()
    img.crossOrigin = "Anonymous"
    img.src = avatarImage

    img.onload = () => {
      const colorThief = new ColorThief()
      const palette    = colorThief.getPalette(img, 2)
      const c1         = `rgb(${palette[0].join(",")})`
      const c2         = `rgb(${palette[1].join(",")})`
      setGradient(`linear-gradient(to right, ${c1}, ${c2})`)
    }

    if(!isOwnProfile) return

    dispatch(setProfileImgLink(avatarImage))
    dispatch(setBannerImgLink(bannerImgLink))
    

  }, [avatarImage, dispatch, isOwnProfile])

  // ── Upload handlers ──────────────────────────────────────────────

  const handleAvatarChange = async (file: File, previewUrl: string) => {
  setAvatarImage(previewUrl)

  const formData = new FormData()
  formData.append("profileImage", file)

  console.log("Sending:", [...formData.entries()]) // ← add here

  const updated = await updateProfile(formData)

  console.log("Response:", updated) // ← add here

  if (updated?.profileImgLink) {
    setAvatarImage(updated.profileImgLink)
    dispatch(setProfileImgLink(updated.profileImgLink))
  }
}

  const handleCoverChange = async (file: File, previewUrl: string) => {
    // 1. Show preview immediately
    setCoverImage(previewUrl)

    // 2. Build FormData and send to backend
    const formData = new FormData()
    formData.append("bannerImage", file) // ← key must match your backend field name

    const updated = await updateProfile(formData)

    // 3. Sync real Cloudinary URL back into store
    if (updated?.bannerImgLink) {
      setCoverImage(updated.bannerImgLink)
      dispatch(setBannerImgLink(updated.bannerImgLink))
    }
  }

  // ─────────────────────────────────────────────────────────────────

  if (loading) return (
    <div className="relative w-full h-80 -mt-12.5 bg-off-black animate-pulse" />
  )

  if (error) return (
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
        <CoverPhotoUpload onImageChange={handleCoverChange}>
          <Button className="bg-chinese-black text-white-smoke cursor-pointer">
            Upload header image
          </Button>
        </CoverPhotoUpload>
      </div>

      <div className="absolute left-10 top-1/2 -translate-y-1/2 group/avatar">
        <AvatarUpload
          avatarImage={avatarImage}
          onImageChange={handleAvatarChange}
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
            {displayName || "No Name"}
          </h1>
          <p className="text-silver font-bold bg-black px-3 py-2">
            {firstName && lastName
              ? `${firstName} ${lastName}`
              : displayName || "No Name"}
          </p>
        </div>
        <div className="bg-black inline-block px-3 py-1 absolute -bottom-10">
          <p className="text-silver font-bold">
            {city && country ? `${city}, ${country}` : "No location"}
          </p>
        </div>
      </div>
    </div>
  )
}
