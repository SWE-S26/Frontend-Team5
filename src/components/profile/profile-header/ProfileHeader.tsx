"use client"

import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import ColorThief from "color-thief-browser"
import AvatarPositionModal from "./Avatarpositionmodal"
import AvatarPopup from "./AvatarPopup"

import Button from "@/components/ui/Button"
import AvatarUpload, { AvatarUploadHandle } from "./AvatarUpload"
import CoverPhotoUpload, { CoverUploadHandle } from "./CoverPhotoUpload"

import { useGetProfile, useUpdateProfileImages } from "@/hooks/useProfile"

import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { setProfileImgLink, setBannerImgLink } from "@/store/slices/authSlice"
import { setProfile, clearProfile } from "@/store/slices/profileSlice"

export default function ProfileHeader() {

  const isPickingFile = useRef(false)
  const DEFAULT_COVER = "https://res.cloudinary.com/dr1sqiouu/image/upload/v1776357570/profile/file_ud25rn.png"

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
  const isOwn          = useAppSelector((state) => state.profile.isOwnProfile)
  const role           = useAppSelector((state) => state.profile.role)

  const [avatarModalOpen,   setAvatarModalOpen]   = useState(false)
  const [avatarPendingUrl,  setAvatarPendingUrl]  = useState<string | null>(null)
  const [avatarPendingFile, setAvatarPendingFile] = useState<File | null>(null)

  const [avatarViewOpen, setAvatarViewOpen] = useState(false)

  const { getProfile, loading, error } = useGetProfile()
  const { updateProfileImages } = useUpdateProfileImages()
  const coverRef = useRef<CoverUploadHandle>(null)
  const coverMenuRef = useRef<HTMLDivElement>(null)
  const [showCoverMenu, setShowCoverMenu] = useState(false)

  const avatarRef = useRef<AvatarUploadHandle>(null)
  const avatarMenuRef = useRef<HTMLDivElement>(null)
  const [showAvatarMenu, setShowAvatarMenu] = useState(false)
  const [coverImage,  setCoverImage]  = useState<string | null>(null)
  const [avatarImage, setAvatarImage] = useState<string | null>(null)
  const [gradient,    setGradient]    = useState("linear-gradient(to right, #c3adb4, #8f6f79)")
  const isOwnProfile = useAppSelector((state) => state.profile.isOwnProfile)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (coverMenuRef.current && !coverMenuRef.current.contains(e.target as Node)) {
        setShowCoverMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleDeleteCover = async () => {
    setShowCoverMenu(false)
    setCoverImage(null)
    await updateProfileImages({ removeBannerImg: true })
    dispatch(setBannerImgLink(""))
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(e.target as Node)) {
        setShowAvatarMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleDeleteAvatar = async () => {
    setShowAvatarMenu(false)
    setAvatarImage(null)
    setGradient("linear-gradient(to right, #c3adb4, #8f6f79)")
    await updateProfileImages({ removeProfileImg: true })
    dispatch(setProfileImgLink(""))
  }

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
        bannerLinks:    data.bannerLinks,
        supportLink:    data.supportLink,
        favoriteGenres: data.favoriteGenres,
        followersCount:  data.followersCount,
        followedCount:   data.followedCount,
        trackCount:      data.trackCount,
        isFollowed:      data.isFollowed,
        isBlocked:       data.isBlocked,
        amIBlocked:      data.amIBlocked,
        role:            data.role,
        isOwnProfile:    data.userId === authUserId,
      }))
    })
    .finally(() => {
      dispatch(setProfile({ isLoading: false }))
    })

    return () => { dispatch(clearProfile()) }
  }, [userId, hasHydrated])

  useEffect(() => {
    if (bannerImgLink && bannerImgLink !== DEFAULT_COVER) {
      setCoverImage(bannerImgLink)
    } else {
      setCoverImage(null)
    }
  }, [bannerImgLink])

  useEffect(() => {
    if (profileImgLink && profileImgLink !== DEFAULT_COVER) {
      setAvatarImage(profileImgLink)
    } else {
      setAvatarImage(null)
    }
  }, [profileImgLink])

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

    if (!isOwnProfile) return

    dispatch(setProfileImgLink(avatarImage))
    dispatch(setBannerImgLink(bannerImgLink))
  }, [avatarImage, dispatch, isOwnProfile])

  const handleAvatarChange = async (file: File, previewUrl: string) => {
    setAvatarPendingFile(file)
    setAvatarPendingUrl(previewUrl)
    setAvatarModalOpen(true)
  }

  const handleAvatarModalSave = async (croppedFile: File, croppedDataUrl: string) => {
    setAvatarModalOpen(false)
    setAvatarImage(croppedDataUrl)
    const updated = await updateProfileImages({ profileImg: croppedFile })
    if (updated?.profileImgLink) {
      setAvatarImage(updated.profileImgLink)
      dispatch(setProfileImgLink(updated.profileImgLink))
    }
  }

  const handleCoverChange = async (file: File, previewUrl: string) => {
    setCoverImage(previewUrl)
    const updated = await updateProfileImages({ bannerImg: file })
    if (updated?.bannerImgLink) {
      setCoverImage(updated.bannerImgLink)
      dispatch(setBannerImgLink(updated.bannerImgLink))
    }
  }

  if (loading) return (
    <div className="relative w-full h-80 -mt-12.5 bg-off-black animate-pulse" />
  )

  if (error) return (
    <div className="relative w-full h-80 -mt-12.5 bg-off-black flex items-center justify-center">
      <p className="text-red-400 text-sm">{error}</p>
    </div>
  )

  return (
    <>
      <div
        className="relative w-full h-56 sm:h-72 md:h-80 group -mt-12.5"
        style={
          coverImage
            ? { backgroundImage: `url(${coverImage})`, backgroundSize: "cover", backgroundPosition: "center" }
            : { background: gradient }
        }
      >
        {/* Cover upload button */}
        <div
          ref={coverMenuRef}
          className="absolute top-4 sm:top-8 right-3 sm:right-6 flex flex-col gap-3"
        >
          <CoverPhotoUpload
            ref={coverRef}
            onImageChange={handleCoverChange}
            disableClick
          >
            <Button
              data-testid="Upload header image-button-CoverPhotoUpload"
              className="bg-chinese-black text-white-smoke cursor-pointer text-xs sm:text-sm px-2 sm:px-4"
              onClick={(e) => {
                e.stopPropagation()
                setShowCoverMenu((prev) => !prev)
              }}
            >
              <span className="hidden sm:inline">Upload header image</span>
              <span className="sm:hidden">Cover</span>
            </Button>
          </CoverPhotoUpload>

          {showCoverMenu && (
            <div className="absolute right-0 top-[110%] z-50 w-48 bg-[#111] border border-white/10 rounded-sm shadow-2xl overflow-hidden">
              <button
                data-testid="Replace image-button-menuCover"
                onClick={() => {
                  setShowCoverMenu(false)
                  coverRef.current?.openFilePicker()
                }}
                className="w-full text-left px-4 py-3 text-sm font-semibold text-white hover:bg-white/5 transition-colors border-b border-white/5"
              >
                Replace image
              </button>
              {coverImage && (
                <button
                  data-testid="Delete image-button-menuCover"
                  onClick={handleDeleteCover}
                  className="w-full text-left px-4 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Delete image
                </button>
              )}
            </div>
          )}
        </div>

        {/* Avatar */}
        <div
          className="absolute left-3 sm:left-6 md:left-10 top-1/2 -translate-y-1/2 group/avatar"
          ref={avatarMenuRef}
          onClick={(e) => {
            const clickedButton = (e.target as HTMLElement).closest("button")
            if (avatarImage && !clickedButton && !isPickingFile.current) setAvatarViewOpen(true)
          }}
        >
          <AvatarUpload
            ref={avatarRef}
            avatarImage={avatarImage}
            onImageChange={handleAvatarChange}
            className="relative overflow-hidden"
            disableClick={isOwnProfile}
          >
            <div className="absolute inset-0 bg-gray-400/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
            {isOwn && (
              <Button
                data-testid="Upload image-button-AvatarUpload"
                className={`bg-chinese-black text-white-smoke absolute bottom-1 right-5 sm:bottom-6 sm:right-6 md:bottom-9 md:right-9 cursor-pointer text-[10px] sm:text-sm px-1.5 py-1 sm:px-3 sm:py-2
                  ${avatarImage ? "opacity-0 group-hover/avatar:opacity-100" : "opacity-100"}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setShowAvatarMenu((prev) => !prev)
                }}
              >
                <span className="hidden sm:inline">Upload image</span>
                <span className="sm:hidden">Upload</span>
              </Button>
            )}
          </AvatarUpload>

          {isOwnProfile && showAvatarMenu && (
            <div className="absolute left-1/2 -translate-x-1/2 top-[85%] z-50 w-48 bg-[#111] border border-white/10 rounded-sm shadow-2xl overflow-hidden">
              <button
                data-testid="Replace image-button-menuAvatar"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowAvatarMenu(false)
                  isPickingFile.current = true
                  avatarRef.current?.openFilePicker()
                  setTimeout(() => { isPickingFile.current = false }, 500)
                }}
                className="w-full text-left px-4 py-3 text-sm font-semibold text-white hover:bg-white/5 transition-colors border-b border-white/5"
              >
                Replace image
              </button>
              {avatarImage && (
                <button
                  data-testid="Delete image-button-menuAvatar"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteAvatar()
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Delete image
                </button>
              )}
            </div>
          )}
        </div>

        {/* Name / location block */}
        <div className="absolute left-35 sm:left-31 md:left-64 bottom-15 sm:bottom-8 md:bottom-24 -translate-y-1/2">
          <div className="flex flex-col items-start">
            <h1 className="text-sm sm:text-2xl md:text-3xl font-bold text-white bg-black px-2 py-1 sm:px-3 sm:py-2 truncate max-w-35 sm:max-w-none">
              {displayName || "No Name"}
            </h1>
            <p className="text-silver font-bold bg-black px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-base truncate max-w-35 sm:max-w-none">
              {firstName || lastName ? `${firstName || ""} ${lastName || ""}`.trim() : displayName || "No Name"}
            </p>
          </div>

          <div className="bg-black inline-block px-2 sm:px-3 py-1 absolute -bottom-8 sm:-bottom-10">
            <p className="text-silver font-bold text-xs sm:text-sm">
              {(city || country) ? [city, country].filter(Boolean).join(", ") : "No location"}
            </p>
          </div>

          {role === 'Pro' && (
            <div className="bg-black/60 inline-flex items-center gap-1.5 px-1 absolute -bottom-16 sm:-bottom-20">
              <img src="/payment/pro-badge.svg" alt="Pro badge" className="w-3 h-3" />
              <p className="text-white font-bold text-xs">ARTIST PRO</p>
            </div>
          )}
        </div>
      </div>

      <AvatarPositionModal
        isOpen={avatarModalOpen}
        imageUrl={avatarPendingUrl ?? ""}
        originalFile={avatarPendingFile}
        onSave={handleAvatarModalSave}
        onCancel={() => {
          setAvatarModalOpen(false)
          setAvatarPendingUrl(null)
          setAvatarPendingFile(null)
        }}
      />

      <AvatarPopup
        isOpen={avatarViewOpen}
        onCancel={() => setAvatarViewOpen(false)}
      />
    </>
  )
}