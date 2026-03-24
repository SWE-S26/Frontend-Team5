import { Message, MessageContentType } from '@/types/message.types'

export function getMessageType(message: Message): MessageContentType {
    return message.type
}