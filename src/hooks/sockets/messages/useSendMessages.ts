    import { useState } from 'react'
    import { Message } from '@/types/message.types'
    import { sendMessage } from '@/services/message.service'

    export const useSendMessage = (onSuccess?: (message: Message) => void) => {
    const [isSending, setIsSending] = useState(false)

    const send = async (receiverId: string, content: string) => {
        if (!content.trim()) return
        setIsSending(true)
        try {
        const newMessage = await sendMessage({ receiverId, content })
        onSuccess?.(newMessage)
        } finally {
        setIsSending(false)
        }
    }

    return { send, isSending }
    }