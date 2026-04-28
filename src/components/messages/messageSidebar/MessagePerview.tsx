import { formatDistanceToNow } from 'date-fns'

interface MessagePerviewProps {
  chatId:        string
  displayName:   string
  photoUrl:      string
  lastMessage:   string
  lastMessageAt: string
  isUnread:      boolean
  isActive:      boolean
  onClick:       () => void
}

const MessagePerview = ({ chatId, displayName, photoUrl, lastMessage, lastMessageAt, isUnread, isActive, onClick }: MessagePerviewProps) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center px-4 py-3 rounded-lg w-full cursor-pointer ${isActive ? 'bg-off-black' : 'hover:bg-off-black'}`}
    >
      <div className='relative shrink-0 mr-3'>
        <img src={photoUrl} alt={displayName} className="rounded-full w-12 h-12" />
        {isUnread && (
          <span className='absolute top-0 -left-3 w-2 h-2 bg-inferno rounded-full' />
        )}
      </div>

      <div className='flex flex-col gap-2 w-full min-w-0'>
        <div className='flex justify-between gap-2'>
          <p className='text-sm text-white-smoke font-bold truncate'>{displayName}</p>
          <p className='text-sm text-silver whitespace-nowrap'>
            {formatDistanceToNow(new Date(lastMessageAt), { addSuffix: true })}
          </p>
        </div>
        <p className='text-sm text-silver truncate'>{lastMessage}</p>
      </div>
    </div>
  )
}

export default MessagePerview
