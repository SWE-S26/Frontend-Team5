import { Message, MessageContentType } from '@/types/messageTypes'

export function getMessageType(message: Message): MessageContentType {
    return message.type
}