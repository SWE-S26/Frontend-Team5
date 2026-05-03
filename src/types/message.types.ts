// ─── Raw backend shapes ────────────────────────────────────────────────────────

export interface ChatLastMessage {
  _id: string;
  senderId: string;
  content: string;
  seenBy: string[];
  createdAt: string;
}

export interface ChatParticipant {
  _id: string;
  displayName: string;
  profileImg: {
    imgLink: string;
    publicId: string;
  };
}

export interface ChatReceiver {
  displayName: string;
  photoUrl: string;
}

// Shape of each item in GET /api/messages/v1/chats
// NOTE: backend returns "chat" not "chatId"
export interface ChatConversation {
  chat: string; // the conversation ID
  participants: ChatParticipant[];
  lastMessage: ChatLastMessage;
  receiver: ChatReceiver;
}

// GET /api/messages/v1/chats response
export interface GetChatsResponse {
  message: string;
  data: ChatConversation[];
}

// Shape of each message in GET /api/messages/v1/chat/message/{chatId}
export interface ChatMessage {
  _id: string;
  chatId: string;
  senderId: string;
  content: string;
  seenBy: string[];
  createdAt: string;
}

// GET /api/messages/v1/chat/message/{chatId} response
export interface GetChatMessagesResponse {
  message: string;
  data: {
    messages: ChatMessage[];
    isReceiverBlocked: boolean;
  };
}

// POST /api/messages/v1/send — request body
export interface SendMessagePayload {
  receiverId: string;
  content: string;
}

// POST /api/messages/v1/send — response (updated conversation object)
export interface SendMessageResponse {
  message: string;
  data: ChatConversation;
}

// ─── Socket shapes ─────────────────────────────────────────────────────────────

export interface SocketConversationUpdate {
  _id: string;
  archivedBy: string[];
  lastMessage: ChatLastMessage;
  sender: {
    displayName: string;
    photoUrl: string;
  };
  createdAt: string;
  updatedAt: string;
}

// ─── UI-friendly normalized shapes ────────────────────────────────────────────

export interface Conversation {
  chatId: string; // mapped from "chat" field
  receiverId: string; // participant._id that is NOT the current user
  displayName: string; // receiver.displayName
  photoUrl: string; // receiver.photoUrl
  lastMessage: string;
  lastMessageAt: string;
  isUnread: boolean; // true when currentUserId NOT in lastMessage.seenBy
}

export interface Message {
  id: string; // mapped from _id
  chatId: string;
  senderId: string;
  content: string;
  seenBy: string[];
  createdAt: string;
}
