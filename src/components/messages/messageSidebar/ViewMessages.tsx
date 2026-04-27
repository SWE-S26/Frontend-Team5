'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Preview from '../preview'
import { useMessagesContext } from '@/components/messages/MessagesContext'

interface ViewMessagesProps {
  onClose?: () => void
}

const ViewMessages = ({ onClose }: ViewMessagesProps) => {
  const router                        = useRouter()
  const { conversations, markAsRead } = useMessagesContext()
  

 const handleSelect = (chatId: string) => {
    markAsRead(chatId)
    onClose?.()                              // ← close the navbar popup
    router.push(`/message?chatId=${chatId}`)
  }

  return (
    <div className='border-off-black border rounded-md bg-chinese-black'>
      <div className='flex flex-col w-full px-2 py-3'>
        <div className='flex justify-between ml-2 mb-1'>
          <p className='text-md font-bold text-white-smoke'>Messages</p>
        </div>

        {conversations.map((conversation) => (
          <Preview
            key={conversation.chatId}
            id={conversation.chatId}
            username={conversation.displayName}
            avatarUrl={conversation.photoUrl}
            lastMessage={conversation.lastMessage}
            lastMessageAt={conversation.lastMessageAt}
            isUnread={conversation.isUnread}
            isActive={false}
            onClick={() => handleSelect(conversation.chatId)}
          />
        ))}
      </div>

      <div className='bg-chinese-black py-3 flex justify-center hover:text-silver'>
        <Link href='/message' className='font-bold text-sm bg-chinese-black'>
          View all messages
        </Link>
      </div>
    </div>
  )
}

export default ViewMessages
