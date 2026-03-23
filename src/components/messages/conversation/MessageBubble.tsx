import { formatDistanceToNow } from 'date-fns'

interface MessageBubbleProps {
    avatarUrl: string
    username: string
    content: string
    createdAt: string
    isMe: boolean
}


const MessageBubble = ({ avatarUrl, username, content, createdAt, isMe }: MessageBubbleProps) => {
    return (
        <div >
            <div className='flex gap-3 mb-8'>
                
                <img src={avatarUrl} alt='Profile Image' className='w-12 h-12 rounded-full object-cover shrink-0' />
                
                
                <div className='flex flex-col gap-1 min-w-0 w-full'>
                    <div className='flex justify-between gap-4'>
                    <p className='text-sm text-white-smoke font-bold hover:text-silver'>
                        {isMe ? 'Me' : username}
                    </p>
                    <p className='text-sm text-silver shrink-0'>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</p>
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
        </div>
    )
}

export default MessageBubble