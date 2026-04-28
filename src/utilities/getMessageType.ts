import { Message } from '@/types/message.types'

export type MessageContentType = 'text' | 'link' | 'sc_track' | 'sc_playlist' | 'sc_album'

export function getMessageType(message: Message): MessageContentType {
  const { content } = message

  if (content.startsWith('http')) {
    if (content.includes('/tracks/'))   return 'sc_track'
    if (content.includes('/playlists/')) return 'sc_playlist'
    if (content.includes('/albums/'))   return 'sc_album'
    return 'link'
  }

  return 'text'
}