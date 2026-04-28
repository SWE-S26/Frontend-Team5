import { useState, useEffect, useCallback, useRef } from "react"
import { messageService } from "@/services/message.service"
import { getSocket } from "@/lib/sockets/socket"
import { useAppSelector } from "@/store/hooks"
import { messageToastBus } from "@/lib/sockets/messageToastBus"
import { useSocketContext } from "@/lib/sockets/SocketContext"
import { Socket } from "socket.io-client"

import type {
  Conversation,
  Message,
  ChatConversation,
  SocketConversationUpdate,
} from "@/types/message.types"

// ─── Normalize helpers ─────────────────────────────────────────────────────────

function normalizeConversation(raw: ChatConversation, currentUserId: string): Conversation {
  // receiverId is the participant whose _id is NOT the current user
  const receiverParticipant = raw.participants.find((p) => p._id !== currentUserId)

  return {
    chatId:        raw.chat,                        // backend field is "chat" not "chatId"
    receiverId:    receiverParticipant?._id ?? "",
    displayName:   raw.receiver.displayName,
    photoUrl:      raw.receiver.photoUrl,
    lastMessage:   raw.lastMessage.content,
    lastMessageAt: raw.lastMessage.createdAt,
    isUnread:      !raw.lastMessage.seenBy.includes(currentUserId),
  }
}

function normalizeMessage(raw: {
  _id: string
  chatId: string
  senderId: string
  content: string
  seenBy: string[]
  createdAt: string
}): Message {
  return {
    id:        raw._id,
    chatId:    raw.chatId,
    senderId:  raw.senderId,
    content:   raw.content,
    seenBy:    raw.seenBy,
    createdAt: raw.createdAt,
  }
}

// ─── useConversations ──────────────────────────────────────────────────────────

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading]             = useState(false)

  const currentUserId = useAppSelector((state) => state.auth.userId) ?? ""

  const fetchConversations = useCallback(async () => {
    setLoading(true)
    try {
      const res        = await messageService.getChats()
      const normalized = res.data.data.map((raw) =>
        normalizeConversation(raw, currentUserId)
      )
      setConversations(normalized)
    } catch (err) {
      console.error("Failed to fetch conversations:", err)
    } finally {
      setLoading(false)
    }
  }, [currentUserId])

  const markAsRead = useCallback(async (chatId: string) => {
    try {
      await messageService.markAsRead(chatId)
      setConversations((prev) =>
        prev.map((c) => c.chatId === chatId ? { ...c, isUnread: false } : c)
      )
    } catch (err) {
      console.error("Failed to mark as read:", err)
    }
  }, [])

  const markAsUnread = useCallback(async (chatId: string) => {
    try {
      await messageService.markAsUnread(chatId)
      setConversations((prev) =>
        prev.map((c) => c.chatId === chatId ? { ...c, isUnread: true } : c)
      )
    } catch (err) {
      console.error("Failed to mark as unread:", err)
    }
  }, [])

  const archiveConversation = useCallback(async (chatId: string) => {
    try {
      await messageService.archiveConversation(chatId)
      setConversations((prev) => prev.filter((c) => c.chatId !== chatId))
    } catch (err) {
      console.error("Failed to archive conversation:", err)
    }
  }, [])

  const updateFromSocket = useCallback((data: SocketConversationUpdate) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.chatId === data._id
          ? {
              ...c,
              lastMessage:   data.lastMessage.content,
              lastMessageAt: data.lastMessage.createdAt,
              isUnread:      true,
            }
          : c
      )
    )
  }, [])

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  return { conversations, loading, markAsRead, markAsUnread, archiveConversation, updateFromSocket }
}

// ─── useMessages ───────────────────────────────────────────────────────────────

export function useMessages(chatId: string | null) {
  const [messages,          setMessages]          = useState<Message[]>([])
  const [isReceiverBlocked, setIsReceiverBlocked] = useState(false)
  const [loading,           setLoading]           = useState(false)

  useEffect(() => {
    if (!chatId) return
    const fetch = async () => {
      setLoading(true)
      try {
        const res = await messageService.getChatMessages(chatId)
        setMessages(res.data.data.messages.map(normalizeMessage))
        setIsReceiverBlocked(res.data.data.isReceiverBlocked)
      } catch (err) {
        console.error("Failed to fetch messages:", err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [chatId])

  const addMessage = useCallback((raw: {
    _id: string; chatId: string; senderId: string
    content: string; seenBy: string[]; createdAt: string
  }) => {
    setMessages((prev) => [...prev, normalizeMessage(raw)])
  }, [])

  return { messages, isReceiverBlocked, loading, addMessage }
}

// ─── useSendMessage ────────────────────────────────────────────────────────────

export function useSendMessage(onSuccess?: (raw: {
  _id: string; chatId: string; senderId: string
  content: string; seenBy: string[]; createdAt: string
}) => void) {
  const [isSending, setIsSending] = useState(false)

  const send = useCallback(async (receiverId: string, content: string) => {
  if (!content.trim()) return
  setIsSending(true)
  try {
    const res  = await messageService.sendMessage({ receiverId, content })
    const last = res.data.data.lastMessage
    onSuccess?.({
      _id:       last._id,
      chatId:    res.data.data.chat,
      senderId:  last.senderId,
      content:   last.content,
      seenBy:    last.seenBy,
      createdAt: last.createdAt,
    })
  } catch (err: any) {
    // 403 means the receiver has blocked the current user
    if (err?.response?.status === 403) {
      messageToastBus.emit({
        type:    'error',
        message: 'Unable to send message to this user.',
      })
    } else {
      console.error("Failed to send message:", err)
    }
  } finally {
    setIsSending(false)
  }
}, [onSuccess])
  return { send, isSending }
}

// ─── useChatSocket ─────────────────────────────────────────────────────────────

export function useChatSocket(
  chatId: string | null,
  onIncomingMessage: (raw: {
    _id: string; chatId: string; senderId: string
    content: string; seenBy: string[]; createdAt: string
  }) => void
) {
  const onIncomingMessageRef = useRef(onIncomingMessage)
  useEffect(() => {
    onIncomingMessageRef.current = onIncomingMessage
  }, [onIncomingMessage])

  // Use context socket instead of getSocket() — avoids race condition
  const { socketRef } = useSocketContext()

  useEffect(() => {
    if (!chatId) return

    const handler = (data: any) => {
      onIncomingMessageRef.current({
        _id:       data.lastMessage._id,
        chatId:    chatId,
        senderId:  data.lastMessage.senderId,
        content:   data.lastMessage.content,
        seenBy:    data.lastMessage.seenBy,
        createdAt: data.lastMessage.createdAt,
      })
    }

    const joinAndListen = (socket: Socket) => {
  console.log("🟢 Joining chat room:", chatId)
  socket.emit("chat:join", { chatId }, (response: any) => {
    console.log("✅ chat:join acknowledged:", response)
  })
  socket.off("message:send")
  socket.on("message:send", (data: any) => {
    console.log("📨 message:send received:", data)
    handler(data)
  })
  // Also listen to message:notify to see which one fires
  socket.on("message:notify", (data: any) => {
    console.log("🔔 message:notify received instead of message:send:", data)
  })
}

    return () => {
      if (socketRef.current) {
        socketRef.current.emit("chat:leave", { chatId })
        socketRef.current.off("message:send", handler)
      }
    }
  }, [chatId, socketRef.current]) // re-runs when socket becomes available

  const sendViaSocket = useCallback((content: string) => {
    if (!chatId || !content.trim()) return
    const socket = socketRef.current
    if (socket?.connected) {
      socket.emit("message:send", { chatId, content })
    }
  }, [chatId])

  return { sendViaSocket }
}