"use client"
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSendMessage } from '@/hooks/sockets/useMessaging'
import { messageToastBus } from '@/lib/sockets/messageToastBus'
import Button from '@/components/ui/Button'

interface PrefilledUser {
  userId:      string
  displayName: string
  photoUrl:    string
}

interface NewMessagePopUPProps {
  isOpen:         boolean
  onClose:        () => void
  prefilledUser?: PrefilledUser
}

const NewMessagePopUP = ({ isOpen, onClose, prefilledUser }: NewMessagePopUPProps) => {
  const [content,   setContent]   = useState('')
  const [recipient, setRecipient] = useState<PrefilledUser | null>(prefilledUser ?? null)

  const { send, isSending } = useSendMessage(() => {
    // Show sent toast
    if (recipient) {
      messageToastBus.emit({
        type:           'sent',
        recipientName:  recipient.displayName,
        recipientPhoto: recipient.photoUrl,
      })
    }
    setContent('')
    setRecipient(null)
    onClose()
  })

  const handleSend = async () => {
    if (!recipient || !content.trim()) return
    await send(recipient.userId, content)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className='fixed inset-0 bg-white/30 z-1001 flex items-start pt-25 justify-center'
          onClick={onClose}
        >
          <button
            className='fixed top-4 right-4 text-white-smoke text-2xl font-bold bg-off-black rounded-full w-11 h-11 flex items-center justify-center hover:text-silver cursor-pointer z-1002'
            onClick={onClose}
          >
            ✕
          </button>

          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className='flex flex-col w-200 p-6 bg-black rounded-md relative'
            onClick={(e) => e.stopPropagation()}
          >
            <p className='text-xl text-white-smoke font-bold mb-8'>New message</p>

            <div className='flex flex-col gap-3 mb-7'>
              <p className='text-md font-bold text-white-smoke'>
                To<span className='text-red-500'>*</span>
              </p>
              <div className='w-full min-h-12 bg-off-black px-3 py-2 rounded flex items-center flex-wrap gap-2'>
                {recipient ? (
                  <div className='flex items-center gap-2 bg-chinese-black rounded px-2 py-1'>
                    <img
                      src={recipient.photoUrl}
                      alt={recipient.displayName}
                      className='w-6 h-6 rounded-full object-cover'
                    />
                    <span className='text-white-smoke text-sm font-bold'>
                      {recipient.displayName}
                    </span>
                    <button
                      onClick={() => setRecipient(null)}
                      className='text-silver hover:text-white text-xs ml-1 cursor-pointer'
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <span className='text-silver text-sm'>No recipient selected</span>
                )}
              </div>
            </div>

            <div className='flex flex-col gap-3 mb-5'>
              <p className='text-md font-bold text-white-smoke'>
                Write your message and add tracks or playlists
                <span className='text-red-500'>*</span>
              </p>
              <textarea
                className="w-full h-29 bg-off-black px-3 py-3 text-white-smoke rounded resize-y caret-crusta text-md"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isSending}
              />
            </div>

            <div className='ml-auto'>
              <Button
                onClick={handleSend}
                disabled={!recipient || !content.trim() || isSending}
                className='text-black text-sm bg-white-smoke disabled:opacity-50'
              >
                {isSending ? 'Sending...' : 'Send'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default NewMessagePopUP
