import { useState, useEffect, useCallback, useRef } from "react";
import { messageService } from "@/services/message.service";
import { useAppSelector } from "@/store/hooks";
import { messageToastBus } from "@/lib/sockets/messageToastBus";
import type {
  Conversation,
  Message,
  ChatConversation,
  SocketConversationUpdate,
} from "@/types/message.types";

// ─── Normalize helpers ─────────────────────────────────────────────────────────

function normalizeConversation(
  raw: ChatConversation,
  currentUserId: string,
): Conversation {
  const receiverParticipant = raw.participants.find(
    (p) => p._id !== currentUserId,
  );

  return {
    chatId: raw.chat,
    receiverId: receiverParticipant?._id ?? "",
    displayName: raw.receiver.displayName,
    photoUrl: raw.receiver.photoUrl,
    lastMessage: raw.lastMessage.content,
    lastMessageAt: raw.lastMessage.createdAt,
    isUnread: !raw.lastMessage.seenBy.includes(currentUserId),
  };
}

function normalizeMessage(raw: {
  _id: string;
  chatId: string;
  senderId: string;
  content: string;
  seenBy: string[];
  createdAt: string;
}): Message {
  return {
    id: raw._id,
    chatId: raw.chatId,
    senderId: raw.senderId,
    content: raw.content,
    seenBy: raw.seenBy,
    createdAt: raw.createdAt,
  };
}

// ─── useConversations ──────────────────────────────────────────────────────────

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);

  const currentUserId = useAppSelector((state) => state.auth.userId) ?? "";

  const fetchConversations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await messageService.getChats();
      const normalized = res.data.data.map((raw) =>
        normalizeConversation(raw, currentUserId),
      );
      setConversations(normalized);
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  // Optimistic update — flip isUnread: false immediately before the API call
  // so the UI clears instantly and wins the race against updateFromSocket
  const markAsRead = useCallback(async (chatId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.chatId === chatId ? { ...c, isUnread: false } : c)),
    );
    try {
      await messageService.markAsRead(chatId);
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  }, []);

  const markAsUnread = useCallback(async (chatId: string) => {
    try {
      await messageService.markAsUnread(chatId);
      setConversations((prev) =>
        prev.map((c) => (c.chatId === chatId ? { ...c, isUnread: true } : c)),
      );
    } catch (err) {
      console.error("Failed to mark as unread:", err);
    }
  }, []);

  const archiveConversation = useCallback(async (chatId: string) => {
    try {
      await messageService.archiveConversation(chatId);
      setConversations((prev) => prev.filter((c) => c.chatId !== chatId));
    } catch (err) {
      console.error("Failed to archive conversation:", err);
    }
  }, []);

  // Called by SocketInitializer when message:notify fires
  // Real socket payload uses "chat" field not "_id" — handle both
  const updateFromSocket = useCallback((data: SocketConversationUpdate) => {
    const incomingChatId = data._id ?? (data as any).chat;
    setConversations((prev) =>
      prev.some((c) => c.chatId === incomingChatId)
        ? prev.map((c) =>
            c.chatId === incomingChatId
              ? {
                  ...c,
                  lastMessage: data.lastMessage.content,
                  lastMessageAt: data.lastMessage.createdAt,
                  isUnread: true,
                }
              : c,
          )
        : prev,
    );
  }, []);

  // Called on local send success to update sidebar immediately
  const updateFromLocalSend = useCallback(
    (raw: ChatConversation) => {
      const normalized = normalizeConversation(raw, currentUserId);
      setConversations((prev) => {
        const exists = prev.some((c) => c.chatId === normalized.chatId);
        if (exists) {
          return prev.map((c) =>
            c.chatId === normalized.chatId
              ? {
                  ...c,
                  lastMessage: normalized.lastMessage,
                  lastMessageAt: normalized.lastMessageAt,
                  isUnread: false,
                }
              : c,
          );
        }
        return [...prev, { ...normalized, isUnread: false }];
      });
    },
    [currentUserId],
  );

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    loading,
    markAsRead,
    markAsUnread,
    archiveConversation,
    updateFromSocket,
    updateFromLocalSend,
  };
}

// ─── useMessages ───────────────────────────────────────────────────────────────

export function useMessages(chatId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isReceiverBlocked, setIsReceiverBlocked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!chatId) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await messageService.getChatMessages(chatId);
        setMessages(res.data.data.messages.map(normalizeMessage));
        setIsReceiverBlocked(res.data.data.isReceiverBlocked);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [chatId]);

  const addMessage = useCallback(
    (raw: {
      _id: string;
      chatId: string;
      senderId: string;
      content: string;
      seenBy: string[];
      createdAt: string;
    }) => {
      setMessages((prev) => {
        // Prevent duplicate — check if message with same _id already exists
        if (prev.some((m) => m.id === raw._id)) return prev;
        return [...prev, normalizeMessage(raw)];
      });
    },
    [],
  );

  return { messages, isReceiverBlocked, loading, addMessage };
}

// ─── useSendMessage ────────────────────────────────────────────────────────────

export function useSendMessage(
  onSuccess?: (payload: {
    message: {
      _id: string;
      chatId: string;
      senderId: string;
      content: string;
      seenBy: string[];
      createdAt: string;
    };
    conversation: ChatConversation;
  }) => void,
) {
  const [isSending, setIsSending] = useState(false);

  const send = useCallback(
    async (receiverId: string, content: string) => {
      if (!content.trim()) return;
      setIsSending(true);
      try {
        const res = await messageService.sendMessage({ receiverId, content });
        const last = res.data.data.lastMessage;
        onSuccess?.({
          message: {
            _id: last._id,
            chatId: res.data.data.chat,
            senderId: last.senderId,
            content: last.content,
            seenBy: last.seenBy,
            createdAt: last.createdAt,
          },
          conversation: res.data.data,
        });
      } catch (err: any) {
        if (err?.response?.status === 403) {
          messageToastBus.emit({
            type: "error",
            message: "Unable to send message to this user.",
          });
        } else {
          console.error("Failed to send message:", err);
        }
      } finally {
        setIsSending(false);
      }
    },
    [onSuccess],
  );

  return { send, isSending };
}
