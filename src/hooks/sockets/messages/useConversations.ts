    import { useState, useEffect } from 'react'
    import { Conversation } from '@/types/message.types'
    import { getConversations } from '@/services/message.service'

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

    const markAsUnread = (userId: string) => {
            setConversations(prev =>
                prev.map(c => c.userId === userId ? { ...c, isUnread: true } : c)
            )
        }



    const archiveConversation = (userId: string) => {
        setConversations((prev) =>
        prev.filter((c) => c.userId !== userId)
        )
    }

    return { conversations, markAsRead, markAsUnread, archiveConversation }
    }