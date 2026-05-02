'use client'
import { useState } from 'react'
import NewMessagePopUP from '../NewMessagePopUP'
import MessagePerview from './MessagePerview'
import Button from '@/components/ui/Button'
import type { Conversation } from '@/types/message.types'
import EmptyMessages from '@/components/messages/EmptyMessages'

interface MessageSidebarProps {
  onSelect:       (chatId: string) => void
  selectedChatId: string | null
  conversations:  Conversation[]
  markAsRead:     (chatId: string) => Promise<void>
}

const MessageSidebar = ({ onSelect, selectedChatId, conversations, markAsRead }: MessageSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (chatId: string) => {
    markAsRead(chatId)
    onSelect(chatId)
  }

  const sortedConversations = [...conversations].sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  )

  return (
    <>
      <div className='flex flex-col w-full px-2 py-3'>
        <div className='flex justify-between ml-2 mb-4'>
          <p className='text-3xl font-bold text-white-smoke'>Messages</p>
          <Button className="bg-white-smoke text-chinese-black cursor-pointer" onClick={() => setIsOpen(true)}>
            New
          </Button>
        </div>

        <NewMessagePopUP
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSent={(chatId) => {
            markAsRead(chatId)
            onSelect(chatId)
          }}
        />

        {sortedConversations.map((conversation) => (
          <MessagePerview
            key={conversation.chatId}
            chatId={conversation.chatId}
            displayName={conversation.displayName}
            photoUrl={conversation.photoUrl}
            lastMessage={conversation.lastMessage}
            lastMessageAt={conversation.lastMessageAt}
            isUnread={conversation.isUnread}
            isActive={selectedChatId === conversation.chatId}
            onClick={() => handleSelect(conversation.chatId)}
          />
        ))}

        {!selectedChatId && (
          <div className="block md:hidden mt-4">
            <EmptyMessages onOpenPopup={() => setIsOpen(true)} />
          </div>
        )}
      </div>
    </>
  )
}

export default MessageSidebar