"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setProfile, setProfileLoading, setProfileError, clearProfile } from "@/store/slices/profileSlice"
import { useGetProfile } from "@/hooks/useProfile"
import FollowButton from "../ui/FollowButton"
import { FaUser } from "react-icons/fa"
import { PiWaveformBold } from "react-icons/pi"


interface Props {
  posterId: string
}

export default function TrackUploader({ posterId }: Props) {
  const dispatch = useAppDispatch()
  const { getProfile } = useGetProfile()
  const hasHydrated = useAppSelector((state) => state.auth.hasHydrated)
  const authUserId  = useAppSelector((state) => state.auth.userId)

  const displayName = useAppSelector((s) => s.profile.displayName)
  const profileImg  = useAppSelector((s) => s.profile.profileImgLink)
  const profile = useAppSelector((s) => s.profile)

  useEffect(() => {
      if (!hasHydrated || !posterId) return
  
      dispatch(setProfile({ isLoading: true }))
      getProfile(posterId).then((data) => {
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
        dispatch(setProfile({ isLoading: false }))  // ← always runs
      })
  
      return () => { dispatch(clearProfile()) }
    }, [posterId, hasHydrated])

  return (
    <div className="w-[260px] bg-[#111] rounded-xl p-4 flex flex-col items-center gap-3 text-white shadow-lg">

      {/* Avatar */}
      <img
        src={profile.profileImgLink || "/default-avatar.png"}
        className="w-20 h-20 rounded-full object-cover "
      />

      {/* Name */}
      <div className="text-center">
        <h2 className="text-sm font-semibold">
          {profile.displayName || "Unknown"}
        </h2>

        <p className="text-xs text-gray-400">
          {profile.bio }
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-gray-300">
        <div className="flex items-center gap-1">
          <span><FaUser></FaUser></span>
          <span>{profile.followersCount || 0}</span>
        </div>

        <div className="flex items-center gap-1">
          <span><PiWaveformBold className="w-4 h-4"></PiWaveformBold></span>
          <span>{profile.trackCount || 0}</span>
        </div>
      </div>

      {/* Follow Button */}
      <FollowButton
        userId={profile.userId ?? undefined}
        initialIsFollowing={profile.isFollowed}
      />
      {/* Report */}
      <button className="text-xs text-red-400 hover:text-red-300">
        Report
      </button>
    </div>
  )
}