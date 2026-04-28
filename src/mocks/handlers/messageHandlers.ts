import { http, HttpResponse } from "msw"
import type { ChatConversation, ChatMessage } from "@/types/message.types"

const BASE = "/api/messages/v1"

const CURRENT_USER_ID = "me-123"

// ─── Mock data ─────────────────────────────────────────────────────────────────

const mockConversations: ChatConversation[] = [
  {
    chat: "chat-001",                          // "chat" not "chatId"
    participants: [
      {
        _id: CURRENT_USER_ID,
        displayName: "Me",
        profileImg: { imgLink: "/profpic.jpg", publicId: "profile/me" },
      },
      {
        _id: "user-456",
        displayName: "hazemyasser6",
        profileImg: {
          imgLink: "https://res.cloudinary.com/example/image/upload/profile1.png",
          publicId: "profile/hazemyasser6",
        },
      },
    ],
    lastMessage: {
      _id: "msg-001",
      senderId: "user-456",
      content: "Hey, check out my new track!",
      seenBy: ["user-456"],                    // CURRENT_USER_ID absent → isUnread: true
      createdAt: "2026-04-25T10:30:00.000Z",
    },
    receiver: {
      displayName: "hazemyasser6",
      photoUrl: "https://res.cloudinary.com/example/image/upload/profile1.png",
    },
  },
  {
    chat: "chat-002",
    participants: [
      {
        _id: CURRENT_USER_ID,
        displayName: "Me",
        profileImg: { imgLink: "/profpic.jpg", publicId: "profile/me" },
      },
      {
        _id: "user-789",
        displayName: "benokeno0",
        profileImg: {
          imgLink: "https://res.cloudinary.com/example/image/upload/profile2.png",
          publicId: "profile/benokeno0",
        },
      },
    ],
    lastMessage: {
      _id: "msg-010",
      senderId: CURRENT_USER_ID,
      content: "Sounds amazing, keep it up!",
      seenBy: [CURRENT_USER_ID, "user-789"],   // both seen → isUnread: false
      createdAt: "2026-04-24T15:00:00.000Z",
    },
    receiver: {
      displayName: "benokeno0",
      photoUrl: "https://res.cloudinary.com/example/image/upload/profile2.png",
    },
  },
]

const mockMessages: Record<string, ChatMessage[]> = {
  "chat-001": [
    {
      _id: "msg-001",
      chatId: "chat-001",
      senderId: "user-456",
      content: "Hey, check out my new track!",
      seenBy: ["user-456"],
      createdAt: "2026-04-25T10:30:00.000Z",
    },
  ],
  "chat-002": [
    {
      _id: "msg-009",
      chatId: "chat-002",
      senderId: "user-789",
      content: "Loved your last set",
      seenBy: [CURRENT_USER_ID, "user-789"],
      createdAt: "2026-04-24T14:50:00.000Z",
    },
    {
      _id: "msg-010",
      chatId: "chat-002",
      senderId: CURRENT_USER_ID,
      content: "Sounds amazing, keep it up!",
      seenBy: [CURRENT_USER_ID, "user-789"],
      createdAt: "2026-04-24T15:00:00.000Z",
    },
  ],
}

// ─── Handlers ──────────────────────────────────────────────────────────────────

export const messageHandlers = [

  // GET /api/messages/v1/chats
  http.get(`${BASE}/chats`, () => {
    return HttpResponse.json({
      message: "Chat History Retrieved Successfully",
      data: mockConversations,
    })
  }),

  // GET /api/messages/v1/chat/message/:chatId
  http.get(`${BASE}/chat/message/:chatId`, ({ params }) => {
    const messages = mockMessages[params.chatId as string] ?? []
    return HttpResponse.json({
      message: "Chat Messages Retrieved Successfully",
      data: { messages, isReceiverBlocked: false },
    })
  }),

  // PATCH /api/messages/v1/chat/read/
  http.patch(`${BASE}/chat/read/`, async ({ request }) => {
    const body = await request.json() as { chatId: string }
    const conv = mockConversations.find((c) => c.chat === body.chatId)
    if (conv && !conv.lastMessage.seenBy.includes(CURRENT_USER_ID)) {
      conv.lastMessage.seenBy.push(CURRENT_USER_ID)
    }
    return HttpResponse.json({ message: "Conversation marked as read" })
  }),

  // PATCH /api/messages/v1/chat/unread/
  http.patch(`${BASE}/chat/unread/`, async ({ request }) => {
    const body = await request.json() as { chatId: string }
    const conv = mockConversations.find((c) => c.chat === body.chatId)
    if (conv) {
      conv.lastMessage.seenBy = conv.lastMessage.seenBy.filter((id) => id !== CURRENT_USER_ID)
    }
    return HttpResponse.json({ message: "Conversation marked as unread" })
  }),

  // PATCH /api/messages/v1/archive
  http.patch(`${BASE}/archive`, async ({ request }) => {
    const body = await request.json() as { chatId: string }
    const index = mockConversations.findIndex((c) => c.chat === body.chatId)
    if (index !== -1) mockConversations.splice(index, 1)
    return HttpResponse.json({ message: "Conversation archived" })
  }),

  // POST /api/messages/v1/send
  http.post(`${BASE}/send`, async ({ request }) => {
    const body = await request.json() as { receiverId: string; content: string }
    const newMessage: ChatMessage = {
      _id:       `msg-${Date.now()}`,
      chatId:    "chat-001",
      senderId:  CURRENT_USER_ID,
      content:   body.content,
      seenBy:    [CURRENT_USER_ID],
      createdAt: new Date().toISOString(),
    }
    const conv = mockConversations[0]
    if (conv) {
      conv.lastMessage = {
        _id:       newMessage._id,
        senderId:  newMessage.senderId,
        content:   newMessage.content,
        seenBy:    newMessage.seenBy,
        createdAt: newMessage.createdAt,
      }
      mockMessages["chat-001"]?.push(newMessage)
    }
    return HttpResponse.json(
      { message: "Message sent successfully", data: conv },
      { status: 201 }
    )
  }),
]