"use client"

import Conversation from '@/components/messages/conversation/Conversation'
import EmptyMessages from '@/components/messages/EmptyMessages'
import MessageSidebar from '@/components/messages/messageSidebar/MessageSidebar'
import NewMessagePopUP from '@/components/messages/NewMessagePopUP'
import { useConversations } from '@/hooks/messages/useConversations'
import { useState , useEffect} from 'react'


const page = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { conversations, markAsRead } = useConversations()
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const selectedConversation = conversations.find(c => c.userId === selectedUserId)

  useEffect(() => {
  if (conversations.length > 0 && !selectedUserId) {
    const firstUserId = conversations[0].userId
    setSelectedUserId(firstUserId)
    markAsRead(firstUserId)
  }
}, [conversations.length])

  return (
    <div className='flex justify-between'>



        <div className='w-[30%]'>
              <MessageSidebar 
                onSelect={setSelectedUserId} 
                selectedUserId={selectedUserId}
                conversations={conversations}
                markAsRead={markAsRead}
              />
            </div>


        <div className='w-[67%] '>
                {selectedConversation ? (
                <Conversation
                  userId={selectedConversation.userId}
                  username={selectedConversation.username}
                  avatarUrl={selectedConversation.avatarUrl}
                />
              ) : (
                <>
                  <EmptyMessages onOpenPopup={() => setIsOpen(true)} />
                  <NewMessagePopUP isOpen={isOpen} onClose={() => setIsOpen(false)} />
                </>
              )}
                  
        </div>
    </div>
  )
}

export default page