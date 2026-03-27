import UserCard from './UserCard'
import EmptyCard from './EmptyCard'

const users = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
] // replace with real data later

const UserCardGrid = () => {
  const remainder = users.length % 5
  const emptySlots = remainder === 0 ? 0 : 5 - remainder

  const slots = [
    ...users.map(user => ({ type: 'user' as const, data: user })),
    ...Array(emptySlots).fill({ type: 'empty' as const })
  ]

  return (
    <div className="grid grid-cols-5 gap-4">
      {slots.map((slot, index) =>
        slot.type === 'user'
          ? <UserCard key={slot.data.id} />
          : <EmptyCard key={`empty-${index}`} />
      )}
    </div>
  )
}

export default UserCardGrid