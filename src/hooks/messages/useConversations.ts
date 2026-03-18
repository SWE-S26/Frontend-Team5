    import { useState, useEffect } from 'react'
    import { Conversation } from '@/types/messageTypes'
    import { getConversations } from '@/services/messageService'

    export const useConversations = () => {
    const [conversations, setConversations] = useState<Conversation[]>([])

    useEffect(() => {
        getConversations().then((data) => {
        const visible = data.filter((c) => !c.isArchived)
        setConversations(visible)
        })
    }, [])

    const markAsRead = (userId: string) => {
        setConversations((prev) =>
        prev.map((c) =>
            c.userId === userId && c.isUnread
            ? { ...c, isUnread: false }
            : c
        )
        )
    }

    const archiveConversation = (userId: string) => {
        setConversations((prev) =>
        prev.filter((c) => c.userId !== userId)
        )
    }

    return { conversations, markAsRead, archiveConversation }
    }