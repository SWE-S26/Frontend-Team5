'use client'

import { useState } from 'react'
import Link from 'next/link'
import Preview from '../preview'
import { useConversations } from '@/hooks/sockets/messages/useConversations'

const ViewMessages = () => {
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const { conversations, markAsRead } = useConversations()

    const handleSelect = (userId: string) => {
        setSelectedId(userId)
        markAsRead(userId)
    }
    

    return (
    <div className='border-off-black border rounded-md bg-chinese-black'>

        <div className='flex flex-col w-full px-2 py-3   '>
            <div className='flex justify-between ml-2 mb-1'>
                    <p className='text-md font-bold text-white-smoke'>Messages</p>
                </div>
                {conversations.map((conversation) => (
                    <Preview
                        key={conversation.userId}
                        id={conversation.userId}
                        username={conversation.username}
                        avatarUrl={conversation.avatarUrl}
                        lastMessage={conversation.lastMessage}
                        lastMessageAt={conversation.lastMessageAt}
                        isUnread={conversation.isUnread}
                        isActive={selectedId === conversation.userId}
                        onClick={() => handleSelect(conversation.userId)}
                    />
                ))}
            </div>

            <div className=' bg-chinese-black py-3 flex justify-center hover:text-silver '>
                <Link href={'/message'} className=' font-bold text-sm bg-chinese-black'> View all messages</Link>
            </div>
            
    </div>
  )
}

export default ViewMessages