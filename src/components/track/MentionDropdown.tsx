import { Avatar } from "antd"
import { MentionUser } from "@/types/comments.types"

interface MentionDropdownProps {
  suggestions: MentionUser[]
  onSelect: (user: MentionUser) => void
}

export default function MentionDropdown({ suggestions, onSelect }: MentionDropdownProps) {
  if (suggestions.length === 0) return null

  return (
    <div className="absolute bottom-full left-0 mb-1 w-64 bg-[#222] border border-white/10 rounded-md shadow-xl z-50 overflow-hidden">
      {suggestions.map((user) => (
        <button
          key={user.userId}
          onMouseDown={(e) => {
            e.preventDefault()
            onSelect(user)
          }}
          className="flex items-center gap-3 w-full px-3 py-2 hover:bg-white/10 transition cursor-pointer text-left"
        >
          <Avatar src={user.avatarUrl || undefined} size={28} />
          <span className="text-white-smoke text-sm truncate">{user.displayName}</span>
        </button>
      ))}
    </div>
  )
}