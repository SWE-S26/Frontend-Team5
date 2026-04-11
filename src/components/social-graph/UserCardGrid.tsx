import UserCard from './UserCard'
import EmptyCard from './EmptyCard'
import EmptySocial from './EmptySocial'
import { SocialUser } from '@/types/social.types'
import { Spin } from 'antd'

interface UserCardGridProps {
  users:      SocialUser[]
  loading?:   boolean
  emptyType:  'followers' | 'following'
  isOwn?:       boolean
  displayName?: string
}

const COLS = 5

const UserCardGrid = ({ users, loading = false, emptyType, isOwn, displayName }: UserCardGridProps) => {

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    )
  }

  if (users.length === 0) {
    return <EmptySocial type={emptyType} isOwn={isOwn} displayName={displayName} />
  }

  const remainder  = users.length % COLS
  const emptySlots = remainder === 0 ? 0 : COLS - remainder

  const slots = [
    ...users.map(user => ({ type: 'user' as const, data: user })),
    ...Array(emptySlots).fill({ type: 'empty' as const }),
  ]

  return (
    <div className="grid grid-cols-5 justify-between gap-4">
      {slots.map((slot, index) =>
        slot.type === 'user'
          ? <UserCard key={slot.data.userId} user={slot.data} />
          : <EmptyCard key={`empty-${index}`} />
      )}
    </div>
  )
}

export default UserCardGrid