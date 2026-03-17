import { http, HttpResponse } from 'msw'
import { mockConversations, mockMessages } from '@/mocks/message'

export const messageHandlers = [

  // GET /api/message → returns all conversations
    http.get('/api/message', () => {
        return HttpResponse.json(mockConversations)
    }),

    // GET /api/message/conversation/:userId → returns messages for that user
    http.get('/api/message/conversation/:userId', ({ params }) => {
        const { userId } = params
        const messages = mockMessages.filter(
        (m) => m.senderId === userId || m.receiverId === userId
        )
        return HttpResponse.json(messages)
    }),

    // POST /api/message/send → adds a new message
    http.post('/api/message/send', async ({ request }) => {
        const body = await request.json() as { receiverId: string; content: string }
        const newMessage = {
        id: `msg-${Date.now()}`,
        senderId: 'me-123',
        receiverId: body.receiverId,
        content: body.content,
        createdAt: new Date().toISOString(),
        isRead: false,
        }
        mockMessages.push(newMessage)
        return HttpResponse.json(newMessage, { status: 201 })
    }),

    // PATCH /api/message/:messageId/read → marks one message as read
    http.patch('/api/message/:messageId/read', ({ params }) => {
        const { messageId } = params
        const message = mockMessages.find((m) => m.id === messageId)
        if (message) message.isRead = true
        return HttpResponse.json({ success: true })
    }),

    // GET /api/message/unread-count → returns unread status
    http.get('/api/message/unread-count', () => {
        const count = mockConversations.filter((c) => c.isUnread).length
        return HttpResponse.json({ count })
    }),

    ]