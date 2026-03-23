import { Message, Conversation } from "@/types/messageTypes";

export const mockConversations: Conversation[] = [
  {
    userId: "user-1",
    username: "Mikasa Ackerman",
    avatarUrl: "/testp2.jpeg",
    lastMessage: "https://on.soundcloud.com/FuhHb5otZh2mFklx",
    lastMessageAt:  new Date(Date.now() - 7 * 60 * 1000).toISOString(),
    isUnread: true,
    isArchived: false,
  },
  {
    userId: "user-2",
    username: "Levi Ackerman",
    avatarUrl: "/testp1.jpeg",
    lastMessage: "dumbass",
    lastMessageAt:  new Date(Date.now() - 24* 60 * 60 * 1000).toISOString(),
    isUnread: false,
    isArchived: false,
  },
];

export const mockMessages: Message[] = [
  {
    id: "msg-1",
    senderId: "user-1",
    receiverId: "me-123",
    content: "hi",
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    isRead: true,
    type: 'text',
  },
  {
    id: "msg-2",
    senderId: "me-123",
    receiverId: "user-1",
    content: "hey! how are you?",
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    isRead: true,
    type: 'text',
  },
  {
    id: "msg-3",
    senderId: "user-1",
    receiverId: "me-123",
    content: "nsns",
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    isRead: true,
    type: 'text',
  },
  {
    id: "msg-4",
    senderId: "me-123",
    receiverId: "user-1",
    content: "sjssk",
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    isRead: true,
    type: 'link',
  },
  {
    id: "msg-5",
    senderId: "user-1",
    receiverId: "me-123",
    content: "test",
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    isRead: true,
    type: 'link',
  },
  {
    id: "msg-6",
    senderId: "user-1",
    receiverId: "me-123",
    content: "https://on.soundcloud.com/FuhHb5otZh2mFklx",
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    isRead: false,
    type: 'link',
  },
];