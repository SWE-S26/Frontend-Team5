'use client'
import { useState } from 'react'
import SendButton from '../SendButton'
import { useSendMessage } from '@/hooks/sockets/messages/useSendMessages'
import { Message } from '@/types/message.types'
import { send } from 'process'
import Button from '@/components/ui/Button'

interface ConversationInputProps {
    receiverId: string
    onMessageSent: (message: Message) => void
}

const ConversationInput = ({ receiverId, onMessageSent }: ConversationInputProps) => {
    const [content, setContent] = useState('')
    const { send, isSending } = useSendMessage(onMessageSent)

    const handleSend = async () => {
        if (!content.trim()) return
        await send(receiverId, content)
        setContent('')
    }

    return (
        <div className='flex flex-col gap-3 mb-5 mt-20 ml-2 mr-2'>
        <p className='text-md font-bold text-white-smoke'>
            Write your message and add tracks or playlists<span className='text-red-500'>*</span>
        </p>
        <textarea
            className="w-full h-25 bg-off-black px-3 py-3  text-white-smoke rounded resize-y caret-crusta text-md"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            
        />
        <div className='flex justify-end'>
            <Button onClick={handleSend} className='text-black text-sm bg-white-smoke' >
                Send
            </Button>
        </div>
        </div>
    )
}

export default ConversationInput