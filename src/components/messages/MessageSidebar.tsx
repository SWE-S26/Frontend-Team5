'use client'
import React, { useState } from 'react'
import NewMessageButton from './NewMessageButton'
import NewMessagePopUP from './NewMessagePopUP'
import MessagePerview from './MessagePerview'

const MessageSidebar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedId, setSelectedId] = useState<number | null>(null)

    return (
        <>
            <div className='flex flex-col gap-0 w-110 px-2 py-3'>
                <div className='flex flex-row gap-50 ml-2 mb-4'>
                <p className='text-3xl font-bold text-white'>Messages</p>
                <NewMessageButton onClick={() => setIsOpen(true)} />
                </div>
                <NewMessagePopUP isOpen={isOpen} onClose={() => setIsOpen(false)} />
                <MessagePerview id={1} isActive={selectedId === 1} onClick={() => setSelectedId(1)} />
                <MessagePerview id={2} isActive={selectedId === 2} onClick={() => setSelectedId(2)} />
            </div>
        </>
    )
}

export default MessageSidebar