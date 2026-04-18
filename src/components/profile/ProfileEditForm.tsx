"use client"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import AvatarUpload from "./profile-header/AvatarUpload"
import Button from "@/components/ui/Button"
import { useAppSelector } from "@/store/hooks"

import { useUpdateProfile, useUpdateProfileImages } from "@/hooks/useProfile"
import { setProfile } from "@/store/slices/profileSlice"
import { useAppDispatch } from "@/store/hooks"

import Cropper from "react-easy-crop"
import type { Area } from "react-easy-crop"
import { useCallback } from "react"

import { IoIosInformationCircle } from "react-icons/io"
import { IoIosLink } from "react-icons/io"
import { FiTrash2 } from "react-icons/fi"

import { FaFacebook, FaInstagram, FaSpotify, FaPaperPlane, FaYoutube, FaTiktok, FaPinterest, FaLinkedin } from "react-icons/fa6"
import { FaSoundcloud, FaTwitter } from "react-icons/fa6"
import { IoEarthSharp } from "react-icons/io5"

interface EditProfilePopUPProps {
  isOpen: boolean
  onClose: () => void
}

interface LinkItem {
  linkId: string
  name:   string
  link:   string
}

const getLinkIcon = (link: string) => {
  const url = link.toLowerCase()
  if (url.includes("facebook.com"))   return <FaFacebook   className="text-silver mt-2.5" />
  if (url.includes("instagram.com"))  return <FaInstagram  className="text-silver mt-2.5" />
  if (url.includes("spotify.com"))    return <FaSpotify    className="text-silver mt-2.5" />
  if (url.includes("soundcloud.com")) return <FaSoundcloud className="text-silver mt-2.5" />
  if (url.includes("twitter.com") || url.includes("x.com")) return <FaTwitter className="text-silver mt-2.5" />
  if (url.includes("youtube.com"))    return <FaYoutube    className="text-silver mt-2.5" />
  if (url.includes("tiktok.com"))     return <FaTiktok     className="text-silver mt-2.5" />
  if (url.includes("pinterest.com"))  return <FaPinterest  className="text-silver mt-2.5" />
  if (url.includes("linkedin.com"))   return <FaLinkedin   className="text-silver mt-2.5" />
  if (url.startsWith("mailto:") || url.includes("gmail.com") || url.includes("@")) return <FaPaperPlane className="text-silver mt-2.5" />
  if (url.trim() === "")              return <IoIosLink    className="text-silver mt-2.5" />
  return <IoEarthSharp className="text-silver mt-2.5" />
}

const ProfileEditForm = ({ isOpen, onClose }: EditProfilePopUPProps) => {
  const profileImgLink   = useAppSelector((state) => state.profile.profileImgLink)
  const displayName      = useAppSelector((state) => state.profile.displayName)
  const firstName        = useAppSelector((state) => state.profile.firstName)
  const lastName         = useAppSelector((state) => state.profile.lastName)
  const profileLink      = useAppSelector((state) => state.profile.profileLink)
  const city             = useAppSelector((state) => state.profile.city)
  const country          = useAppSelector((state) => state.profile.country)
  const bio              = useAppSelector((state) => state.profile.bio)
  const reduxLinks       = useAppSelector((state) => state.profile.bannerLinks)
  const reduxSupportLink = useAppSelector((state) => state.profile.supportLink)

  const [formLinks,   setFormLinks]   = useState<LinkItem[]>([])
  const [linkErrors,  setLinkErrors]  = useState<Record<string, boolean>>({})

  const [avatarImage,     setAvatarImage]     = useState<string | null>(null)
  const [formDisplayName, setFormDisplayName] = useState("")
  const [formProfileLink, setFormProfileLink] = useState("")
  const [formFirstName,   setFormFirstName]   = useState("")
  const [formLastName,    setFormLastName]     = useState("")
  const [formCity,        setFormCity]         = useState("")
  const [formCountry,     setFormCountry]      = useState("")
  const [formBio,         setFormBio]          = useState("")
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null)

  const [rawImageUrl,   setRawImageUrl]   = useState<string | null>(null)
const [rawFile,       setRawFile]       = useState<File | null>(null)
const [isCropping,    setIsCropping]    = useState(false)
const [crop,          setCrop]          = useState({ x: 0, y: 0 })
const [zoom,          setZoom]          = useState(1)
const [croppedArea,   setCroppedArea]   = useState<Area | null>(null)
const fileInputRef = useRef<HTMLInputElement>(null)


  const [formSupportLink,     setFormSupportLink]     = useState<string | null>(null)
  const [showSupportLinkInfo, setShowSupportLinkInfo] = useState(false)

  const [displayNameError, setDisplayNameError] = useState(false)
  const [profileLinkError, setProfileLinkError] = useState(false)
  const [showLinksInfo,    setShowLinksInfo]    = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  const dispatch = useAppDispatch()
  const { updateProfile, loading, error } = useUpdateProfile()

  const linksInfoRef       = useRef<HTMLDivElement>(null)
  const supportLinkInfoRef = useRef<HTMLDivElement>(null)

  // refs to always have latest Redux values without being dependencies
  const profileImgLinkRef   = useRef(profileImgLink)
  const displayNameRef      = useRef(displayName)
  const firstNameRef        = useRef(firstName)
  const lastNameRef         = useRef(lastName)
  const profileLinkRef      = useRef(profileLink)
  const cityRef             = useRef(city)
  const countryRef          = useRef(country)
  const bioRef              = useRef(bio)
  const reduxLinksRef       = useRef(reduxLinks)
  const reduxSupportLinkRef = useRef(reduxSupportLink)

  // keep refs in sync with Redux
  useEffect(() => { profileImgLinkRef.current   = profileImgLink },   [profileImgLink])
  useEffect(() => { displayNameRef.current       = displayName },      [displayName])
  useEffect(() => { firstNameRef.current         = firstName },        [firstName])
  useEffect(() => { lastNameRef.current          = lastName },         [lastName])
  useEffect(() => { profileLinkRef.current       = profileLink },      [profileLink])
  useEffect(() => { cityRef.current              = city },             [city])
  useEffect(() => { countryRef.current           = country },          [country])
  useEffect(() => { bioRef.current               = bio },              [bio])
  useEffect(() => { reduxLinksRef.current        = reduxLinks },       [reduxLinks])
  useEffect(() => { reduxSupportLinkRef.current  = reduxSupportLink }, [reduxSupportLink])

  const { updateProfileImages } = useUpdateProfileImages()

  async function getCroppedImage(imageSrc: string, croppedAreaPixels: Area, fileName: string): Promise<{ file: File; dataUrl: string }> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload  = () => resolve(img)
    img.onerror = reject
    img.src     = imageSrc
  })
  const canvas = document.createElement("canvas")
  canvas.width  = croppedAreaPixels.width
  canvas.height = croppedAreaPixels.height
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("No canvas context")
  ctx.beginPath()
  ctx.arc(croppedAreaPixels.width / 2, croppedAreaPixels.height / 2, Math.min(croppedAreaPixels.width, croppedAreaPixels.height) / 2, 0, Math.PI * 2)
  ctx.clip()
  ctx.drawImage(image, croppedAreaPixels.x, croppedAreaPixels.y, croppedAreaPixels.width, croppedAreaPixels.height, 0, 0, croppedAreaPixels.width, croppedAreaPixels.height)
  const dataUrl = canvas.toDataURL("image/png")
  const blob    = await (await fetch(dataUrl)).blob()
  const file    = new File([blob], fileName, { type: "image/png" })
  return { file, dataUrl }
}

 
  const handleAvatarChange = useCallback(async (file: File, previewUrl: string) => {
    setAvatarImage(previewUrl)
    setPendingAvatarFile(file)   // ← store file, don't upload yet
    setIsDirty(true)
  }, [])


  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return
  const url = URL.createObjectURL(file)
  setRawFile(file)
  setRawImageUrl(url)
  setCrop({ x: 0, y: 0 })
  setZoom(1)
  setIsCropping(true)
  e.target.value = ""
}

const onCropComplete = useCallback((_: Area, pixels: Area) => {
  setCroppedArea(pixels)
}, [])

const handleReplace = useCallback(async () => {
  if (!croppedArea || !rawFile || !rawImageUrl) return
  const { file, dataUrl } = await getCroppedImage(rawImageUrl, croppedArea, rawFile.name)
  await handleAvatarChange(file, dataUrl)
  setIsDirty(true)
  setIsCropping(false)
  setRawImageUrl(null)
  setRawFile(null)
}, [croppedArea, rawFile, rawImageUrl, handleAvatarChange])

const handleCancelCrop = () => {
  setIsCropping(false)
  setRawImageUrl(null)
  setRawFile(null)
}

  // populate form only when modal opens
  useEffect(() => {
    if (!isOpen) return
    setAvatarImage(profileImgLinkRef.current    || null)
    setFormDisplayName(displayNameRef.current   || "")
    setFormProfileLink(profileLinkRef.current   || "")
    setFormFirstName(firstNameRef.current       || "")
    setFormLastName(lastNameRef.current         || "")
    setFormCity(cityRef.current                 || "")
    setFormCountry(countryRef.current           || "")
    setFormBio(bioRef.current                   || "")
    setFormLinks(
      (reduxLinksRef.current || []).map((l: any) => ({
        linkId: l.linkId || crypto.randomUUID(),
        name: l.name || "",
        link: l.link?.startsWith("mailto:")
          ? l.link.replace("mailto:", "")
          : l.link || "",
      }))
    )
    setFormSupportLink(reduxSupportLinkRef.current || null)
    setLinkErrors({})
    setPendingAvatarFile(null)

    setIsDirty(false)
  }, [isOpen])

  // close links info tooltip on outside click
  useEffect(() => {
    if (!showLinksInfo) return
    const handleClickOutside = (e: MouseEvent) => {
      if (linksInfoRef.current && !linksInfoRef.current.contains(e.target as Node)) {
        setShowLinksInfo(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showLinksInfo])

  // close support link info tooltip on outside click
  useEffect(() => {
    if (!showSupportLinkInfo) return
    const handleClickOutside = (e: MouseEvent) => {
      if (supportLinkInfoRef.current && !supportLinkInfoRef.current.contains(e.target as Node)) {
        setShowSupportLinkInfo(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showSupportLinkInfo])

  const handleAddLink = () => {
    const newLink: LinkItem = { linkId: crypto.randomUUID(), name: "", link: "" }
    setFormLinks((prev) => [...prev, newLink])
    setIsDirty(true)
  }

  const handleRemoveLink = (linkId: string) => {
    setFormLinks((prev) => prev.filter((l) => l.linkId !== linkId))
    setLinkErrors((prev) => {
      const next = { ...prev }
      delete next[linkId]
      return next
    })
    setIsDirty(true)
  }

  const handleLinkChange = (linkId: string, field: "link" | "name", value: string) => {
    setFormLinks((prev) =>
      prev.map((l) => (l.linkId === linkId ? { ...l, [field]: value } : l))
    )
    if (field === "link" && value.trim()) {
      setLinkErrors((prev) => ({ ...prev, [linkId]: false }))
    }
    setIsDirty(true)
  }

  const handleCancel = () => {
    setAvatarImage(profileImgLinkRef.current    || null)
    setFormDisplayName(displayNameRef.current   || "")
    setFormProfileLink(profileLinkRef.current   || "")
    setFormFirstName(firstNameRef.current       || "")
    setFormLastName(lastNameRef.current         || "")
    setFormCity(cityRef.current                 || "")
    setFormCountry(countryRef.current           || "")
    setFormBio(bioRef.current                   || "")
    setFormLinks(
      (reduxLinksRef.current || []).map((l: any) => ({
        linkId: l.linkId || crypto.randomUUID(),
        name:   l.name   || "",
        link:   l.link   || "",
      }))
    )
    setFormSupportLink(reduxSupportLinkRef.current || null)
    setDisplayNameError(false)
    setProfileLinkError(false)
    setPendingAvatarFile(null)
    setLinkErrors({})
    onClose()
  }

const handleSave = async () => {
  let hasError = false

  if (!formDisplayName.trim()) { setDisplayNameError(true); hasError = true }
  if (!formProfileLink.trim()) { setProfileLinkError(true); hasError = true }
  if (hasError) return

  const formattedLinks = formLinks
    .filter((l) => l.link.trim())
    .map(({ linkId, name, link }) => {
      let finalLink = link.trim()
      if (finalLink.includes("@") && !finalLink.startsWith("http")) {
        finalLink = `mailto:${finalLink}`
      } else if (!finalLink.startsWith("http")) {
        finalLink = `https://${finalLink}`
      }
      return { linkId, name, link: finalLink }
    })
    .filter((l, index, self) => index === self.findIndex((x) => x.link === l.link))

  const updateData: any = {
    displayName: formDisplayName,
    profileLink: formProfileLink,
    firstName:   formFirstName.trim()  || null,
    lastName:    formLastName.trim()   || null,
    city:        formCity.trim()       || null,
    country:     formCountry.trim()    || null,
    bio:         formBio.trim()        || null,
    links:       formattedLinks,
    bannerLinks: formattedLinks,
    supportLink: formSupportLink?.trim() || null,
  }

  try {
    // 1. Upload avatar if one is pending — do this BEFORE updateProfile
    //    so finalAvatarUrl holds the real Cloudinary URL, not a blob URL
    let finalAvatarUrl = profileImgLinkRef.current ?? null

    if (pendingAvatarFile) {
      const updated = await updateProfileImages({ profileImg: pendingAvatarFile })
      if (updated?.profileImgLink) {
        finalAvatarUrl = updated.profileImgLink
        setAvatarImage(finalAvatarUrl)
      }
      setPendingAvatarFile(null)
    }

    // 2. Save text fields
    const res = await updateProfile(updateData)
    if (res) {
      dispatch(setProfile({
        displayName:    res.displayName,
        profileLink:    res.profileLink,
        firstName:      res.firstName,
        lastName:       res.lastName,
        city:           res.city,
        country:        res.country,
        bio:            res.bio,
        bannerLinks:    res.bannerLinks?.length ? res.bannerLinks : [],
        profileImgLink: finalAvatarUrl,  // always the real URL, never a blob
        links:          res.links,
        supportLink:    res.supportLink,
      }))
      onClose()
    }
  } catch (err) {
    console.error("Failed to save profile:", err)
  }
}

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-white/30 z-[1001] flex items-start pt-10 justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCancel()
          }}
        >
          <button data-testid="cancel-button-popup"
            className="fixed top-4 right-4 text-white-smoke text-2xl font-bold bg-off-black rounded-full w-11 h-11 flex items-center justify-center hover:text-silver cursor-pointer z-[1002]"
            onClick={handleCancel}
          >
            ✕
          </button>

          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col w-200 p-6 bg-chinese-black rounded-md relative overflow-y-auto max-h-[90vh] scrollbar-hide"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xl text-white-smoke font-bold mb-6">
              Edit your Profile
            </p>

            <div className="flex gap-6 mb-4">
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
  <div className="relative w-40 h-40 group/avatar">
    {isCropping && rawImageUrl ? (
      <div className="relative overflow-hidden rounded-full w-40 h-40">
        <Cropper
          image={rawImageUrl}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          cropSize={{ width: 160, height: 160 }}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          style={{
            containerStyle: { borderRadius: "50%", overflow: "hidden", width: 160, height: 160, background: "#000" },
            cropAreaStyle:  { border: "none", boxShadow: "none" },
          }}
        />
      </div>
    ) : (
      <div
        className="relative overflow-hidden w-40 h-40 rounded-full cursor-pointer group/avatar"
        onClick={() => fileInputRef.current?.click()}
      >
  {avatarImage ? (
    <img src={avatarImage} alt="Avatar" className="w-full h-full object-cover rounded-full" />
  ) : (
    <div className="w-full h-full rounded-full bg-off-black flex items-center justify-center">
      <span className="text-silver text-xs text-center px-2">Upload image</span>
    </div>
  )}
  <div className="absolute inset-0 bg-gray-400/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity rounded-full" />
</div>
    )}
  </div>

  {isCropping && (
    <input data-testid="AvatarZoom-input"
      type="range"
      min={1} max={3} step={0.01}
      value={zoom}
      onChange={(e) => setZoom(Number(e.target.value))}
      className="w-30 accent-white-smoke"
    />
  )}

  {isCropping ? (
    <div className="flex gap-2">
      
      <Button data-testid="Replace-button-ReplaceAvatarInEditForm"
        onClick={handleReplace}
        className="bg-chinese-black text-white-smoke text-xs font-semibold px-3 py-1.5 rounded cursor-pointer"
      >
        Replace
      </Button>
    </div>
  ) : null}

  <input data-testid="Avatar-input"
    ref={fileInputRef}
    type="file"
    accept="image/*"
    className="hidden"
    onChange={(e) => {
      handleFileChange(e)
      setIsDirty(true)
    }}
  />
</div>

              <div className="flex-1 flex flex-col gap-3">

                <div>
                  <p className="text-sm text-white-smoke font-bold mb-1">
                    Display name <span className="text-red-500">*</span>
                  </p>
                  <input data-testid="DisplayName-input"
                    maxLength={40}
                    value={formDisplayName || ""}
                    onChange={(e) => {
                      setFormDisplayName(e.target.value)
                      setIsDirty(true)
                      if (e.target.value.trim()) setDisplayNameError(false)
                    }}
                    className={`w-full bg-off-black px-3 py-2 text-white-smoke rounded border ${
                      displayNameError ? "border-red-500" : "border-transparent"
                    }`}
                    placeholder="Display name"
                  />
                  {displayNameError && (
                    <p className="text-red-500 text-sm mt-1">
                      Enter your display name. You can change it later.
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-sm text-white-smoke font-bold mb-1">
                    Profile URL <span className="text-red-500">*</span>
                  </p>
                  <div className={`flex items-center bg-off-black rounded border ${
                    profileLinkError ? "border-red-500" : "border-transparent"
                  }`}>
                    <span className="text-silver px-3 py-2 whitespace-nowrap border-r border-zinc-700 select-none">
                      beatza.me/
                    </span>
                    <input data-testid="ProfileLink-input"
                      value={formProfileLink || ""}
                      onChange={(e) => {
                        setFormProfileLink(e.target.value)
                        setIsDirty(true)
                        if (e.target.value.trim()) setProfileLinkError(false)
                      }}
                      className="flex-1 bg-transparent px-3 py-2 text-white-smoke outline-none"
                      placeholder="your-profile-link"
                    />
                  </div>
                  {profileLinkError && (
                    <p className="text-red-500 text-sm mt-1">
                      Enter your profile URL. You can change it later.
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <p className="text-sm text-white-smoke font-bold mb-1">First name</p>
                    <input data-testid="FirstName-input"
                      maxLength={40}
                      value={formFirstName || ""}
                      onChange={(e) => {
                        setFormFirstName(e.target.value)
                        setIsDirty(true)
                      }}
                      className="w-full bg-off-black px-3 py-2 text-white-smoke rounded"
                      placeholder="First name"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white-smoke font-bold mb-1">Last name</p>
                    <input data-testid="LastName-input"
                      maxLength={40}
                      value={formLastName || ""}
                      onChange={(e) => {
                        setFormLastName(e.target.value)
                        setIsDirty(true)
                      }}
                      className="w-full bg-off-black px-3 py-2 text-white-smoke rounded"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <p className="text-sm text-white-smoke font-bold mb-1">City</p>
                    <input data-testid="City-input"
                      maxLength={40}
                      value={formCity || ""}
                      onChange={(e) => {
                        setFormCity(e.target.value)
                        setIsDirty(true)
                      }}
                      className="w-full bg-off-black px-3 py-2 text-white-smoke rounded"
                      placeholder="City"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white-smoke font-bold mb-1">Country</p>
                    <input data-testid="Country-input"
                      maxLength={40}
                      value={formCountry || ""}
                      onChange={(e) => {
                        setFormCountry(e.target.value)
                        setIsDirty(true)
                      }}
                      className="w-full bg-off-black px-3 py-2 text-white-smoke rounded"
                      placeholder="Country"
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm text-white-smoke font-bold mb-1">Bio</p>
                  <textarea
                    value={formBio}
                    onChange={(e) => {
                      setFormBio(e.target.value)
                      setIsDirty(true)
                    }}
                    className="w-full h-20 bg-off-black px-3 py-2 text-white-smoke rounded resize-none text-sm"
                    placeholder="Tell the world a little bit about yourself. The shorter the better."
                  />
                </div>

              </div>
            </div>

            {/* Your links header with info tooltip */}
            <div ref={linksInfoRef} className="flex items-center gap-2 mb-2 relative">
              <p className="text-sm text-white-smoke font-bold">Your links</p>
              <button data-testid="info-button-EditForm"
                onClick={() => setShowLinksInfo((prev) => !prev)}
                className="text-silver hover:text-white-smoke transition-colors cursor-pointer"
              >
                <IoIosInformationCircle />
              </button>
              {showLinksInfo && (
                <div className="absolute left-16 -top-2 z-10 w-64 bg-zinc-700 text-white-smoke text-sm rounded-md px-4 py-3 shadow-lg">
                  Add links to your website and social network profiles to help your audience find you wherever you are.
                </div>
              )}
            </div>

            {formLinks.length > 0 && (
              <div className="flex flex-col gap-3 mb-3">
                {formLinks.map((l) => (
                  <div key={l.linkId} className="flex items-start gap-2">
                    <span>{getLinkIcon(l.link)}</span>

                    <div className="flex-1 flex flex-col gap-1">
                      <input data-testid="Link-input"
                        value={l.link || ""}
                        onChange={(e) => {
                          handleLinkChange(l.linkId, "link", e.target.value)
                          setIsDirty(true)
                        }}
                        placeholder="Web or email address *"
                        className={`w-full bg-off-black px-3 py-2 text-white-smoke rounded border ${
                          linkErrors[l.linkId] ? "border-red-500" : "border-transparent"
                        }`}
                      />
                      {linkErrors[l.linkId] && (
                        <p className="text-red-500 text-sm">Enter a web or email address.</p>
                      )}
                    </div>

                    <input data-testid="LinkName-input"
                      maxLength={40}
                      value={l.name || ""}
                      onChange={(e) => {
                        handleLinkChange(l.linkId, "name", e.target.value)
                        setIsDirty(true)
                      }}
                      placeholder="Short title"
                      className="w-40 bg-off-black px-3 py-2 text-white-smoke rounded border border-transparent"
                    />

                    <button data-testid="RemoveLink-button-EditForm"
                      onClick={() => handleRemoveLink(l.linkId)}
                      className="text-silver bg-off-black transition-colors mt-2 cursor-pointer rounded border border-transparent hover:text-red-400"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Support link input row */}
            {formSupportLink !== null && (
              <div className="flex flex-col gap-1 mb-5">
                <div className="flex items-center gap-2">
                  <span className="text-silver">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="16" />
                      <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                  </span>

                  <input data-testid="SupportLink-input"
                    value={formSupportLink}
                    onChange={(e) => {
                      setFormSupportLink(e.target.value)
                      setIsDirty(true)
                    }}
                    placeholder="e.g.: https://paypal.me/username"
                    className="flex-1 bg-off-black px-3 py-2 text-white-smoke rounded border border-transparent"
                  />

                  {/* info icon with tooltip */}
                  <div ref={supportLinkInfoRef} className="relative">
                    <button  data-testid="info-button-EditForm"
                      onClick={() => setShowSupportLinkInfo((prev) => !prev)}
                      className="text-silver hover:text-white-smoke transition-colors cursor-pointer"
                    >
                      <IoIosInformationCircle />
                    </button>
                    {showSupportLinkInfo && (
                      <div className="absolute right-0 -top-2 z-10 w-64 bg-zinc-700 text-white-smoke text-sm rounded-md px-4 py-3 shadow-lg">
                        Add a link to your support page so fans can support you directly.
                      </div>
                    )}
                  </div>

                  <button data-testid="Remove-button-EditForm"
                    onClick={() => { setFormSupportLink(null); setIsDirty(true) }}
                    className="text-silver bg-off-black transition-colors cursor-pointer rounded border border-transparent hover:text-red-400"
                  >
                    <FiTrash2 />
                  </button>
                </div>

                <p className="text-silver text-xs ml-6">
                  Supported platforms: PayPal, Cash app, Venmo, Bandcamp, Shopify, Kickstarter, Patreon, and Gofundme.{" "}
                  <a href="#" className="text-blue-400 hover:underline">Learn more</a>
                </p>
              </div>
            )}

            {/* Add link / Add support link buttons */}
            <div className="flex gap-3 mb-3">
              <button data-testid="AddLink-button-EditForm"
                onClick={handleAddLink}
                className="bg-off-black text-white-smoke px-4 py-2 rounded cursor-pointer"
              >
                Add link
              </button>

              <button data-testid="AddSupportLink-button-EditForm"
                  onClick={() => setFormSupportLink("")}
                  disabled={formSupportLink !== null}
                  className="bg-white-smoke text-chinese-black px-4 py-2 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add support link
              </button>
            </div>

            {/* Links list */}
            

            

            {/* Footer buttons */}
            <div className="flex justify-end gap-3">
              <button data-testid="cancel-button-EditForm"
                onClick={handleCancel}
                className="bg-off-black text-white-smoke px-4 py-2 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button data-testid="Save-button-EditForm"
                onClick={handleSave}
                disabled={loading || !isDirty}
                className="bg-white-smoke text-chinese-black px-4 py-2 rounded cursor-pointer disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save changes"}
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ProfileEditForm
