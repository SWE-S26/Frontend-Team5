"use client";

import { createContext, useContext, ReactNode } from "react";
import { useConversations } from "@/hooks/sockets/useMessaging";
import type {
  Conversation,
  SocketConversationUpdate,
  ChatConversation,
} from "@/types/message.types";

// ─── Context shape ─────────────────────────────────────────────────────────────

interface MessagesContextValue {
  conversations: Conversation[];
  loading: boolean;
  unreadCount: number;
  markAsRead: (chatId: string) => Promise<void>;
  markAsUnread: (chatId: string) => Promise<void>;
  archiveConversation: (chatId: string) => Promise<void>;
  updateFromSocket: (data: SocketConversationUpdate) => void;
  updateFromLocalSend: (data: ChatConversation) => void;
}

const MessagesContext = createContext<MessagesContextValue | null>(null);

// ─── Provider ──────────────────────────────────────────────────────────────────

export function MessagesProvider({ children }: { children: ReactNode }) {
  const {
    conversations,
    loading,
    markAsRead,
    markAsUnread,
    archiveConversation,
    updateFromSocket,
    updateFromLocalSend,
  } = useConversations();

  // Derived — count of conversations with isUnread: true
  const unreadCount = conversations.filter((c) => c.isUnread).length;

  return (
    <MessagesContext.Provider
      value={{
        conversations,
        loading,
        unreadCount,
        markAsRead,
        markAsUnread,
        archiveConversation,
        updateFromSocket,
        updateFromLocalSend,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
}

// ─── Consumer hook ─────────────────────────────────────────────────────────────

export function useMessagesContext(): MessagesContextValue {
  const ctx = useContext(MessagesContext);
  if (!ctx) throw new Error("useMessagesContext must be used inside MessagesProvider");
  return ctx;
}
