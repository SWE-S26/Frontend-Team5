"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Conversation from '@/components/messages/conversation/Conversation'
import EmptyMessages from '@/components/messages/EmptyMessages'
import MessageSidebar from '@/components/messages/messageSidebar/MessageSidebar'
import NewMessagePopUP from '@/components/messages/NewMessagePopUP'
import { useMessagesContext } from '@/components/messages/MessagesContext'

const Page = () => {
  const searchParams                                    = useSearchParams()
  const [isOpen, setIsOpen]                             = useState(false)
  const [selectedChatId, setSelectedChatId]             = useState<string | null>(null)
  const { conversations, markAsRead, markAsUnread }     = useMessagesContext()

  const selectedConversation = conversations.find((c) => c.chatId === selectedChatId)

  // Auto-select from URL query param (coming from navbar popup)
  useEffect(() => {
    const chatIdFromUrl = searchParams.get('chatId')
    if (chatIdFromUrl && conversations.length > 0) {
      const exists = conversations.find((c) => c.chatId === chatIdFromUrl)
      if (exists) {
        setSelectedChatId(chatIdFromUrl)
        markAsRead(chatIdFromUrl)
        return
      }
    }
    // Fallback — auto-select first conversation
    if (conversations.length > 0 && !selectedChatId) {
      const first = conversations[0]
      setSelectedChatId(first.chatId)
      markAsRead(first.chatId)
    }
  }, [conversations.length, searchParams])

  // When a new message arrives for the active chat, updateFromSocket updates lastMessageAt
  // and stamps isUnread: true. Watching lastMessageAt (not isUnread) means this only fires
  // on actual incoming messages — never when the user manually clicks "Mark as unread".
  useEffect(() => {
    if (selectedChatId && selectedConversation?.lastMessageAt) {
      markAsRead(selectedChatId)
    }
  }, [selectedConversation?.lastMessageAt, selectedChatId])

  const hasSelection = Boolean(selectedConversation)

  return (
    <div className='flex flex-col gap-4 px-4 pb-4 md:flex-row md:justify-between md:px-0 md:pb-0'>

      <div className={`w-full md:w-[30%] ${hasSelection ? 'hidden md:block' : ''}`}>
        <MessageSidebar
          onSelect={setSelectedChatId}
          selectedChatId={selectedChatId}
          conversations={conversations}
          markAsRead={markAsRead}
        />
      </div>

      <div className={`w-full md:w-[67%] ${!hasSelection ? 'hidden md:block' : ''}`}>
        {selectedConversation ? (
          <Conversation
            chatId={selectedConversation.chatId}
            receiverId={selectedConversation.receiverId}
            displayName={selectedConversation.displayName}
            photoUrl={selectedConversation.photoUrl}
            isUnread={selectedConversation.isUnread}
            markAsUnread={markAsUnread}
            markAsRead={markAsRead}
            onBack={() => setSelectedChatId(null)}
          />
        ) : (
          <>
            <EmptyMessages onOpenPopup={() => setIsOpen(true)} />
            <NewMessagePopUP
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              onSent={(chatId) => {
                setSelectedChatId(chatId)
                markAsRead(chatId)
              }}
            />
          </>
        )}
      </div>

    </div>
  )
}

export default Page
