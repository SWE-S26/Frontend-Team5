export type MessageToastData =
  | { type: 'sent';     recipientName: string; recipientPhoto: string }
  | { type: 'received'; senderName: string;    senderPhoto: string; content: string }
  | { type: 'error';    message: string }

type Listener = (data: MessageToastData) => void

let listener: Listener | null = null

export const messageToastBus = {
  register: (fn: Listener) => { listener = fn },
  emit:     (data: MessageToastData) => { listener?.(data) },
  clear:    () => { listener = null },
}