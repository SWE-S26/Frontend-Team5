'use client'
import { useState, useEffect } from 'react'
import NewMessageButton from './NewMessageButton'
import NewMessagePopUP from './NewMessagePopUP'
import MessagePerview from './MessagePerview'
import { useConversations } from '@/hooks/messages/useConversations'
const MessageSidebar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const { conversations, markAsRead } = useConversations()

    const handleSelect = (userId: string) => {
        setSelectedId(userId)
        markAsRead(userId)
    }


    return (
        <>
            <div className='flex flex-col w-full px-2 py-3'>
                <div className='flex justify-between ml-2 mb-4'>
                    <p className='text-3xl font-bold text-white-smoke'>Messages</p>
                    <NewMessageButton onClick={() => setIsOpen(true)} />
                </div>
                <NewMessagePopUP isOpen={isOpen} onClose={() => setIsOpen(false)} />
                {conversations.map((conversation) => (
                    <MessagePerview
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
        </>
    )
}

export default MessageSidebar