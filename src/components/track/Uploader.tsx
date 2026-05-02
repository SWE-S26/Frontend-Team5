"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setProfile, clearProfile } from "@/store/slices/profileSlice"
import { useGetProfile } from "@/hooks/useProfile"
import FollowButton from "../ui/FollowButton"
import Button from "../ui/Button"
import { FaUser } from "react-icons/fa"
import { PiWaveformBold } from "react-icons/pi"
import TrackReportPopUp from "@/components/report/TrackReportPopUp"

interface Props {
  posterId: string
  trackId: string
  trackTitle: string
  onUnfollow?: (userId: string) => void
}

export default function TrackUploader({ posterId, trackId, trackTitle, onUnfollow }: Props) {
  const dispatch = useAppDispatch()
  const { getProfile } = useGetProfile()
  const hasHydrated = useAppSelector((state) => state.auth.hasHydrated)
  const authUserId  = useAppSelector((state) => state.auth.userId)
  const profile     = useAppSelector((s) => s.profile)

  const [isReportOpen, setIsReportOpen] = useState(false)

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
        followersCount: data.followersCount,
        followedCount:  data.followedCount,
        trackCount:     data.trackCount,
        isFollowed:     data.isFollowed,
        isBlocked:      data.isBlocked,
        amIBlocked:     data.amIBlocked,
        role:           data.role,
        isOwnProfile:   data.userId === authUserId,
      }))
    })
    .finally(() => {
      dispatch(setProfile({ isLoading: false }))
    })

    return () => { dispatch(clearProfile()) }
  }, [posterId, hasHydrated])

  return (
    <div className="w-[260px] bg-chinese-black rounded-xl p-4 flex flex-col items-center gap-3 text-white-smoke">

      {/* Avatar */}
      <img
        src={profile.profileImgLink || "/default-avatar.png"}
        className="w-20 h-20 rounded-full object-cover"
      />

      {/* Name */}
      <div className="text-center">
        <h2 className="text-sm font-semibold">
          {profile.displayName || "Unknown"}
        </h2>
        <p className="text-xs text-silver">
          {profile.bio}
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-silver">
        <div className="flex items-center gap-1">
          <FaUser />
          <span>{profile.followersCount || 0}</span>
        </div>
        <div className="flex items-center gap-1">
          <PiWaveformBold className="w-4 h-4" />
          <span>{profile.trackCount || 0}</span>
        </div>
      </div>

      {/* Follow Button */}
      <FollowButton
        userId={posterId}
        initialIsFollowing={profile.isFollowed ?? false}
        onUnfollow={() => onUnfollow?.(posterId)}
      />

      {/* Report */}
      <Button
        onClick={() => setIsReportOpen(true)}
        className="text-white-smoke hover:text-silver"
      >
        Report
      </Button>

      <TrackReportPopUp
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        trackTitle={trackTitle}
        violatorId={trackId}
      />
    </div>
  )
}