'use client'
import { useEffect } from 'react'
import { useAppSelector } from '@/store/hooks'
import { useGetFollowers } from '@/hooks/useSocial'
import UserCardGrid from '@/components/social-graph/UserCardGrid'

const FollowersPage = () => {
  const profileUserId = useAppSelector((state) => state.profile.userId)
  const { getFollowers, followers, loading } = useGetFollowers()
  const isOwn       = useAppSelector((state) => state.profile.isOwnProfile)
  const displayName = useAppSelector((state) => state.profile.displayName)

  useEffect(() => {
    if (profileUserId) {
      getFollowers(profileUserId)
    }
  }, [profileUserId])

  return (
    <div className="px-4 sm:px-0">
      <UserCardGrid
        users={followers ?? []}
        loading={loading}
        emptyType="followers"
        isOwn={isOwn}
        displayName={displayName ?? ''}
      />
    </div>
  )
}

export default FollowersPage