"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import ColorThief from "color-thief-browser"

import Button from "@/components/ui/Button"
import AvatarUpload from "./AvatarUpload"
import CoverPhotoUpload from "./CoverPhotoUpload"

export default function ProfileHeader() {

  const params = useParams()
  const userId = params.username as string

  
  console.log("USER ID:", userId) 
  
  const [profile, setProfile] = useState<any>(null)

  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [avatarImage, setAvatarImage] = useState<string | null>(null)

  

  const [gradient, setGradient] = useState(
    "linear-gradient(to right, #c3adb4, #8f6f79)"
  )

  useEffect(() => {
    if (!userId) return

    const fetchProfile = async () => {
  try {
    const res = await fetch(`https://beatza.me/api/profile/v1/${userId}`, {
      cache: "no-store",
       headers: {
       Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OWJlZmFkMjVlMTM5NjliMTY1Yjg5NTIiLCJyb2xlIjoiTGlzdGVuZXIiLCJwYXltZW50SW5mbyI6eyJzdWJzY3JpcHRpb25UeXBlIjoiZnJlZSIsInF1b3RhIjp7InVubGltaXRlZCI6ZmFsc2UsInVzZWRTZWNvbmRzIjowLCJsZWZ0U2Vjb25kcyI6MTIwfX0sImlhdCI6MTc3NDEyNDc4MSwiZXhwIjoxNzc0MTI4MzgxfQ.4n4hogPdUAdubYM1_lsb3DHohBL0kIlJux43LKczTVk`
    }
    })

    const data = await res.json()

    console.log("FULL RESPONSE:", data)

   
    setProfile(data.data || data)

    if (data.data?.profileImgLink || data.profileImgLink) {
      setAvatarImage(data.data?.profileImgLink || data.profileImgLink)
    }

    if (data.data?.bannerImgLink || data.bannerImgLink) {
      setCoverImage(data.data?.bannerImgLink || data.bannerImgLink)
    }

  } catch (err) {
    console.error("Failed to fetch profile", err)
  }
}

    fetchProfile()
  }, [userId])



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

  return (
    <div
      className="relative w-full h-80 group mt-[-50px]"
      style={
        coverImage
          ? {
              backgroundImage: `url(${coverImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
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

          <div className="absolute inset-0 bg-gray-400/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity"></div>

          <Button
            className={`bg-chinese-black text-white-smoke absolute bottom-9 right-9 cursor-pointer 
                ${avatarImage ? "opacity-0 group-hover/avatar:opacity-100" : "opacity-100"
            }`}
            >
            Upload image
          </Button>

        </AvatarUpload>
      </div>

      
      <div className="absolute left-72 bottom-20 -translate-y-1/2">
        <div className="flex flex-col items-start">
        <h1 className="text-3xl font-bold text-white bg-black px-3 py-2">
            {profile?.firstName || "No Name"} {profile?.lastName || "No Name"}
        </h1>

        <p className="text-silver font-bold bg-black px-3 py-2">
            {profile?.firstName || "No Name"} {profile?.lastName || "No Name"}
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