'use client'
import { useState} from 'react'
import NewMessageButton from './NewMessageButton'
import NewMessagePopUP from '../NewMessagePopUP'
import MessagePerview from './MessagePerview'
import { useConversations } from '@/hooks/messages/useConversations'
import { Conversation } from '@/types/messageTypes'

interface MessageSidebarProps {
  onSelect: (userId: string) => void
  selectedUserId: string | null
  conversations: Conversation[]
  markAsRead: (userId: string) => void
}
const MessageSidebar = ({ onSelect, selectedUserId, conversations, markAsRead }: MessageSidebarProps) => {
    const [isOpen, setIsOpen] = useState(false)
    

    const handleSelect = (userId: string) => {
        markAsRead(userId)
        onSelect(userId)
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
                        isActive={selectedUserId === conversation.userId}
                        onClick={() => handleSelect(conversation.userId)}
                    />
                ))}
            </div>
        </>
    )
}

export default MessageSidebar