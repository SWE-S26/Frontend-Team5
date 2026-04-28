import { useEffect, useRef } from 'react'
import ConversationHeader from "./ConversationHeader"
import ConversationInput from "./ConversationInput"
import MessageBubble from "./MessageBubble"
import { useMessages, useSendMessage } from '@/hooks/sockets/useMessaging'
import { useChatRoom } from '@/hooks/sockets/useSocket'
import { useAppSelector } from '@/store/hooks'

interface ConversationProps {
  chatId:       string
  receiverId:   string
  displayName:  string
  photoUrl:     string
  isUnread:     boolean
  markAsUnread: (chatId: string) => Promise<void>
  markAsRead:   (chatId: string) => Promise<void>
}

const Conversation = ({ chatId, receiverId, displayName, photoUrl, isUnread, markAsUnread, markAsRead }: ConversationProps) => {
  const currentUserId = useAppSelector((state) => state.auth.userId)         ?? ""
  const myAvatar      = useAppSelector((state) => state.auth.profileImgLink) ?? "/profpic.jpg"
  const bottomRef     = useRef<HTMLDivElement>(null)

  const { messages, isReceiverBlocked, addMessage } = useMessages(chatId)
  const { send, isSending }                         = useSendMessage(addMessage)

  // useChatRoom handles join/leave/message:send — lives in useSocket.ts
  useChatRoom(chatId, addMessage)

  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [sortedMessages.length])

  return (
    <div className="flex flex-col h-screen">
      <ConversationHeader
        displayName={displayName}
        chatId={chatId}
        receiverId={receiverId}
        isUnread={isUnread}
        initialIsBlocked={isReceiverBlocked}
        markAsUnread={markAsUnread}
        markAsRead={markAsRead}
      />
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {sortedMessages.map((message) => (
          <MessageBubble
            key={message.id}
            avatarUrl={message.senderId === currentUserId ? myAvatar : photoUrl}
            displayName={displayName}
            senderId={message.senderId}
            myId={currentUserId}
            content={message.content}
            createdAt={message.createdAt}
            isMe={message.senderId === currentUserId}
          />
        ))}
        <div ref={bottomRef} />
      </div>
      <ConversationInput
        receiverId={receiverId}
        onSend={send}
        isSending={isSending}
        disabled={isReceiverBlocked}
      />
    </div>
  )
}

export default Conversation
