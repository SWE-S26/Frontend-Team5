'use client'
import React, { useEffect , useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useGetFollowing } from '@/hooks/useSocial'
import User from '@/components/layout/User'

const Following = () => {
  const { username } = useParams<{ username: string }>()
  const profileUserId   = useSelector((state: RootState) => state.profile.userId)
  const followedCount = useSelector((state: RootState) => state.profile.followedCount)

  const { getFollowing, following, loading } = useGetFollowing()

  useEffect(() => {
    if (profileUserId) {
      getFollowing(profileUserId)
    }
  }, [profileUserId])

  // Show only first 3
  const [displayedUsers, setDisplayedUsers] = useState(following?.slice(0, 3) ?? [])

    useEffect(() => {
        setDisplayedUsers(following?.slice(0, 3) ?? [])
    }, [following])

    const handleUnfollow = (userId: string) => {
        setDisplayedUsers(prev => prev.filter(u => u.userId !== userId))
    }

  if (!loading && displayedUsers.length === 0) return null

  return (
    <div className='mb-8'>
      <div className='flex justify-between mb-2 mt-5 cursor-pointer'>
        <Link
          href={`/profile/${profileUserId}/following`} 
          className='font-bold text-sm text-white-smoke hover:text-silver'>
          {followedCount} Following
        </Link>
        <Link
          href={`/profile/${profileUserId}/following`}
          className='text-sm text-silver hover:underline'
        >
          View all
        </Link>
      </div>
      {loading
        ? <p className='text-silver text-sm'>Loading...</p>
                : displayedUsers.map(user => (
            <User key={user.userId} user={user} onUnfollow={handleUnfollow} />
        ))
      }
    </div>
  )
}

export default Following