import { createSlice, PayloadAction } from "@reduxjs/toolkit"

// keeping types minimal for now — expand these once the backend contract is confirmed
interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: string
  read: boolean
}

interface Conversation {
  id: string
  participantId: string
  participantName: string
  participantImgLink: string | null
  lastMessage: string | null
  lastMessageAt: string | null
  unreadCount: number
}

interface MessagesState {
  conversations: Conversation[]
  // messages are keyed by conversationId so you can cache multiple open conversations
  messagesByConversation: Record<string, Message[]>
  activeConversationId: string | null
  isConnected: boolean    // websocket connection status
  isLoading: boolean
  error: string | null
}

const initialState: MessagesState = {
  conversations: [],
  messagesByConversation: {},
  activeConversationId: null,
  isConnected: false,
  isLoading: false,
  error: null,
}

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload
    },

    // called when a new message arrives via websocket or is sent by the user
    addMessage: (state, action: PayloadAction<{ conversationId: string; message: Message }>) => {
      const { conversationId, message } = action.payload
      if (!state.messagesByConversation[conversationId]) {
        state.messagesByConversation[conversationId] = []
      }
      state.messagesByConversation[conversationId].push(message)
    },

    // called when loading chat history for a conversation
    setMessages: (state, action: PayloadAction<{ conversationId: string; messages: Message[] }>) => {
      state.messagesByConversation[action.payload.conversationId] = action.payload.messages
    },

    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      state.activeConversationId = action.payload
    },

    // flips to true when websocket connects, false when it drops
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload
    },

    setMessagesLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },

    clearMessages: () => initialState,
  },
})

export const {
  setConversations,
  addMessage,
  setMessages,
  setActiveConversation,
  setConnected,
  setMessagesLoading,
  clearMessages,
} = messagesSlice.actions

export default messagesSlice.reducer