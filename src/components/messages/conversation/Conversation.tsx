import { useEffect, useRef, useState } from "react";
import ConversationHeader from "./ConversationHeader";
import ConversationInput from "./ConversationInput";
import MessageBubble from "./MessageBubble";
import { useMessages, useSendMessage } from "@/hooks/sockets/useMessaging";
import { useChatRoom } from "@/hooks/sockets/useSocket";
import { useMessagesContext } from "@/components/messages/MessagesContext";
import { useAppSelector } from "@/store/hooks";
import { messageLocalBus } from "@/lib/sockets/messageLocalBus";

interface ConversationProps {
  chatId: string;
  receiverId: string;
  displayName: string;
  photoUrl: string;
  isUnread: boolean;
  markAsUnread: (chatId: string) => Promise<void>;
  markAsRead: (chatId: string) => Promise<void>;
  onBack?: () => void;
}

const Conversation = ({
  chatId,
  receiverId,
  displayName,
  photoUrl,
  isUnread,
  markAsUnread,
  markAsRead,
  onBack,
}: ConversationProps) => {
  const currentUserId = useAppSelector((state) => state.auth.userId) ?? "";
  const myAvatar =
    useAppSelector((state) => state.auth.profileImgLink) ?? "/profpic.jpg";
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, isReceiverBlocked, addMessage } = useMessages(chatId);
  const { updateFromLocalSend } = useMessagesContext();
  const { send, isSending } = useSendMessage(({ message, conversation }) => {
    addMessage(message);
    updateFromLocalSend(conversation);
  });
  const [pendingMessages, setPendingMessages] = useState(
    [] as Array<{
      id: string;
      chatId: string;
      senderId: string;
      content: string;
      seenBy: string[];
      createdAt: string;
    }>,
  );

  // useChatRoom handles join/leave/message:send — lives in useSocket.ts
  useChatRoom(chatId, addMessage);

  // Catch local sends from the new-message popup and render them if this chat is open
  useEffect(() => {
    const handler = (payload: {
      type: "optimistic" | "final" | "rollback";
      chatId: string;
      clientId?: string;
      message?: Parameters<typeof addMessage>[0];
    }) => {
      if (payload.chatId !== chatId) return;

      if (payload.type === "optimistic" && payload.message) {
        setPendingMessages((prev) =>
          prev.some((m) => m.id === payload.message?._id)
            ? prev
            : [
                ...prev,
                {
                  id: payload.message._id,
                  chatId: payload.message.chatId,
                  senderId: payload.message.senderId,
                  content: payload.message.content,
                  seenBy: payload.message.seenBy,
                  createdAt: payload.message.createdAt,
                },
              ],
        );
        return;
      }

      if (payload.type === "rollback" && payload.clientId) {
        setPendingMessages((prev) => prev.filter((m) => m.id !== payload.clientId));
        return;
      }

      if (payload.type === "final" && payload.message) {
        if (payload.clientId) {
          setPendingMessages((prev) => prev.filter((m) => m.id !== payload.clientId));
        }
        addMessage(payload.message);
      }
    };

    messageLocalBus.register(handler);
    return () => messageLocalBus.clear();
  }, [addMessage, chatId]);

  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  const displayMessages = [...sortedMessages, ...pendingMessages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sortedMessages.length, pendingMessages.length]);

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
        onBack={onBack}
      />
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {displayMessages.map((message) => (
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
  );
};

export default Conversation;
