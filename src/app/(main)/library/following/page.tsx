'use client'
import { useEffect, useState , useMemo } from 'react'
import { useAppSelector } from '@/store/hooks'
import { useGetFollowing } from '@/hooks/useSocial'
import UserCardGrid from '@/components/social-graph/UserCardGrid'
import { SocialUser } from '@/types/social.types'

export default function Following() {
  const authUserId = useAppSelector((state) => state.auth.userId)
  const isOwn      = true  // this page is always the logged-in user's following

  const { getFollowing, following, loading } = useGetFollowing()
  const [filterText, setFilterText] = useState('')

  useEffect(() => {
    if (authUserId) {
      getFollowing(authUserId)
    }
  }, [authUserId])

  // Filter locally by displayName
  const filteredUsers = useMemo(() => {
  return (following ?? []).filter(user =>
    user.displayName.toLowerCase().includes(filterText.toLowerCase())
  )
}, [following, filterText])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="font-bold text-sm text-white-smoke">
          Hear what the people you follow have posted:
        </p>
        <input
          type="text"
          placeholder="Filter"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          data-testid="following-filter-input"
          className="bg-off-black text-white-smoke text-sm px-3 py-2 rounded-md outline-none placeholder:text-silver w-74 mr-8"
        />
      </div>

      <UserCardGrid
        users={filteredUsers}
        loading={loading}
        emptyType="following"
        isOwn={isOwn}
      />
    </div>
  )
}