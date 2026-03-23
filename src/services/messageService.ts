import { Message, Conversation, SendMessagePayload } from '@/types/messageTypes'

export async function getConversations(): Promise<Conversation[]> {
  const res = await fetch('/api/message')
  if (!res.ok) throw new Error('Failed to fetch conversations')
  return res.json()
}

export async function getConversation(userId: string): Promise<Message[]> {
  const res = await fetch(`/api/message/conversation/${userId}`)
  if (!res.ok) throw new Error('Failed to fetch conversation')
  return res.json()
}

export async function sendMessage(payload: SendMessagePayload): Promise<Message> {
  const res = await fetch('/api/message/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to send message')
  return res.json()
}

export async function markAsRead(messageId: string): Promise<void> {
  const res = await fetch(`/api/message/${messageId}/read`, { method: 'PATCH' })
  if (!res.ok) throw new Error('Failed to mark message as read')
}

export async function hasUnreadMessages(): Promise<boolean> {
  const res = await fetch('/api/message/unread-count')
  if (!res.ok) throw new Error('Failed to fetch unread status')
  const data = await res.json()
  return data.count > 0
}

export async function archiveConversation(userId: string): Promise<void> {
  const res = await fetch(`/api/message/conversation/${userId}/archive`, { method: 'PATCH' })
  if (!res.ok) throw new Error('Failed to archive conversation')
}