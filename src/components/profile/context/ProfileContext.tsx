// src/context/ProfileContext.tsx
"use client"
import { createContext, useContext, useState, useEffect } from "react"
import { useGetProfile } from "@/hooks/useProfile"
import { GetProfileResponse } from "@/types/profile.types"

interface ProfileContextType {
  profile: GetProfileResponse | null
  setProfile: (profile: GetProfileResponse | null) => void
}

const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  setProfile: () => {}
})

export function ProfileProvider({ userId, children }: { userId: string, children: React.ReactNode }) {
  const { getProfile, profile } = useGetProfile()
  const [profileData, setProfileData] = useState<GetProfileResponse | null>(null)

  useEffect(() => {
    if (!userId) return
    getProfile(userId)
  }, [userId])

  useEffect(() => {
    if (profile) setProfileData(profile)
  }, [profile])

  return (
    <ProfileContext.Provider value={{ profile: profileData, setProfile: setProfileData }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfileContext() {
  return useContext(ProfileContext)
}