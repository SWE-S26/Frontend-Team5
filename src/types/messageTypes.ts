export type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export type Conversation = {
  userId: string;
  username: string;
  avatarUrl: string;
  lastMessage: string;
  lastMessageAt: string;
  isUnread: boolean;
  isArchived: boolean;
}

export type SendMessagePayload = {
  receiverId: string;
  content: string;
}