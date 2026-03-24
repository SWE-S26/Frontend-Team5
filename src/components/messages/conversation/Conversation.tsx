import SendButton from "../SendButton"
import ConversationHeader from "./ConversationHeader"
import ConversationInput from "./ConversationInput"
import MessageBubble from "./MessageBubble"
import { useMessages } from '@/hooks/messages/useMessages'

interface ConversationProps {
    userId: string
    username: string
    avatarUrl: string
    markAsUnread: (userId: string) => void
    markAsRead: (userId: string) => void
}
const Conversation = ({ userId, username, avatarUrl, markAsUnread, markAsRead }: ConversationProps) => {
    const { messages , addMessage } = useMessages(userId)
    const MY_ID = 'me-123'
    return (
        <div className="flex flex-col h-screen">
            <ConversationHeader username={username} userId={userId} markAsUnread={markAsUnread} markAsRead={markAsRead  }/>
            <div className="flex-1 overflow-y-auto scrollbar-hide ">
            {messages.map((message) => (
                <MessageBubble
                    key={message.id}
                    avatarUrl={message.senderId === MY_ID ? '/profpic.jpg' : avatarUrl}
                    username={username}
                    content={message.content}
                    createdAt={message.createdAt}
                    isMe={message.senderId === MY_ID}
                />
                ))}
            <ConversationInput
                receiverId={userId}
                onMessageSent={addMessage}
                />
        </div>
        </div>
    )
}

export default Conversation