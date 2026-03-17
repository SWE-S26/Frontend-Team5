import { formatDistanceToNow } from 'date-fns'
interface PreviewProps {
    id: string
    username: string
    avatarUrl: string
    lastMessage: string
    lastMessageAt: string
    isUnread: boolean
    isActive: boolean
    onClick: () => void
}
const preview = ({id,username, avatarUrl, lastMessage, lastMessageAt, isUnread, isActive, onClick }: PreviewProps) => {
    return (
        <div className='flex items-center px-4 py-3 rounded-lg w-full cursor-pointer'>

            <div className='relative shrink-0 mr-3'>
            <img src={avatarUrl} alt={username} className="rounded-full w-12 h-12" />
            {isUnread && (
            <span className='absolute top-0 -left-3 w-2 h-2 bg-inferno rounded-full' />
            )}
        </div>

        
        <div className='flex flex-col gap-2 w-full min-w-0'>
            <div className='flex justify-between gap-2'>
            <p className='text-sm text-white-smoke font-bold truncate'>{username}</p>
            <p className='text-sm text-silver whitespace-nowrap'> {formatDistanceToNow(new Date(lastMessageAt), { addSuffix: true })} </p>
            </div>
            <p className='text-sm text-silver truncate text-left'>{lastMessage}</p>
        </div>

        </div>
    )
}

export default preview
