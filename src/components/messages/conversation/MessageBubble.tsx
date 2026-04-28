import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface MessageBubbleProps {
  avatarUrl:   string
  displayName: string
  senderId:    string   // used for profile link
  content:     string
  createdAt:   string
  isMe:        boolean
  myId:        string   // current user's ID for own profile link
}

const MessageBubble = ({ avatarUrl, displayName, senderId, content, createdAt, isMe, myId }: MessageBubbleProps) => {
  const profileHref = `/profile/${isMe ? myId : senderId}`

  return (
    <div className='flex gap-3 mb-8'>
      <Link href={profileHref}>
        <img src={avatarUrl} alt='Profile' className='w-12 h-12 rounded-full object-cover shrink-0 hover:opacity-80 transition-opacity' />
      </Link>

      <div className='flex flex-col gap-1 min-w-0 w-full'>
        <div className='flex justify-between gap-4'>
          <Link
            href={profileHref}
            className='text-sm text-white-smoke font-bold hover:text-silver transition-colors'
          >
            {isMe ? 'Me' : displayName}
          </Link>
          <p className='text-sm text-silver shrink-0'>
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </p>
        </div>

        {content.startsWith('http') ? (
          <a href={content} target='_blank' rel='noreferrer' className='text-sm text-blue-400 hover:underline break-all'>
            {content}
          </a>
        ) : (
          <p className='text-sm text-silver wrap-break-word'>{content}</p>
        )}
      </div>
    </div>
  )
}

export default MessageBubble
