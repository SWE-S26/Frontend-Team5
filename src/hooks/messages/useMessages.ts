    import { useState, useEffect } from 'react'
    import { Message } from '@/types/messageTypes'
    import { getConversation, markAsRead } from '@/services/messageService'

    export const useMessages = (userId: string | null) => {
    const [messages, setMessages] = useState<Message[]>([])

    useEffect(() => {
        if (!userId) return
        getConversation(userId).then((data) => {
        setMessages(data)
        // mark all as read when conversation opens
        data.forEach((m) => {
            if (!m.isRead) markAsRead(m.id)
        })
        })
    }, [userId])

    return { messages }
    }