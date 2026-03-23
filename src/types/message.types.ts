
export type MessageContentType = 'text' | 'link' | 'sc_track' | 'sc_playlist' | 'sc_album'

export type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  type: MessageContentType;
  metadata?: {
    embedUrl?: string;
    title?: string;
    thumbnail?: string;
  };
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