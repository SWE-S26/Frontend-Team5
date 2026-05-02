'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { useGetProfileByLink } from '@/hooks/useProfile'
import { setProfile, clearProfile } from '@/store/slices/profileSlice'

export default function ProfileUrlLayout({ children }: { children: React.ReactNode }) {
  const { profileUrl } = useParams()
  const dispatch    = useAppDispatch()
  const hasHydrated = useAppSelector((state) => state.auth.hasHydrated)
  const authUserId  = useAppSelector((state) => state.auth.userId)
  const { getProfileByLink } = useGetProfileByLink()

  useEffect(() => {
    if (!hasHydrated || !profileUrl) return
    const profileLink = profileUrl as string
    dispatch(setProfile({ isLoading: true }))
    getProfileByLink(profileLink).then((data) => {
      if (!data) return
      dispatch(setProfile({
        userId:          data.userId,
        displayName:     data.displayName,
        firstName:       data.firstName,
        lastName:        data.lastName,
        bio:             data.bio,
        profileLink:     data.profileLink,
        profileImgLink:  data.profileImgLink,
        bannerImgLink:   data.bannerImgLink,
        city:            data.city,
        country:         data.country,
        links:           data.links,
        bannerLinks:     data.bannerLinks,
        supportLink:     data.supportLink,
        favoriteGenres:  data.favoriteGenres,
        followersCount:  data.followersCount ?? 0,
        followedCount:   data.followingsCount ?? data.followedCount ?? 0,
        trackCount:      data.trackCount ?? 0,
        isFollowed:      data.isFollowed,
        isBlocked:       data.isBlocked,
        amIBlocked:      data.blockingMe ?? data.amIBlocked ?? false,
        role:            data.role,
        isOwnProfile:    data.userId === authUserId,
      }))
    }).finally(() => {
      dispatch(setProfile({ isLoading: false }))
    })

    return () => { dispatch(clearProfile()) }
  }, [profileUrl, hasHydrated])

  return <>{children}</>
}