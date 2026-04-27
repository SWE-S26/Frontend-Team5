import api from "@/lib/api"
import type {
  GetChatsResponse,
  GetChatMessagesResponse,
  SendMessagePayload,
  SendMessageResponse,
} from "@/types/message.types"

export const messageService = {

  // GET /api/messages/v1/chats
  getChats: () =>
    api.get<GetChatsResponse>("/api/messages/v1/chats"),

  // GET /api/messages/v1/chat/message/{chatId}
  getChatMessages: (chatId: string) =>
    api.get<GetChatMessagesResponse>(`/api/messages/v1/chat/message/${chatId}`),

  // PATCH /api/messages/v1/chat/read/ — body: { chatId }
  markAsRead: (chatId: string) =>
    api.patch("/api/messages/v1/chat/read/", { id: chatId }),

  // PATCH /api/messages/v1/chat/unread/ — body: { chatId }
  markAsUnread: (chatId: string) =>
    api.patch("/api/messages/v1/chat/unread/", { id: chatId }),

  // PATCH /api/messages/v1/archive — body: { chatId }
  archiveConversation: (chatId: string) =>
    api.patch("/api/messages/v1/archive", { chatId }),

  // POST /api/messages/v1/send — body: { receiverId, content }
  sendMessage: (payload: SendMessagePayload) =>
    api.post<SendMessageResponse>("/api/messages/v1/send", payload),

}