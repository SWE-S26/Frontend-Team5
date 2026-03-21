"use client"

import EmptyMessages from '@/components/messages/EmptyMessages'
import MessageSidebar from '@/components/messages/MessageSidebar'
import NewMessagePopUP from '@/components/messages/NewMessagePopUP'
import { useState } from 'react'


const page = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className='flex justify-between'>
      <div className='w-[38%]'>
        <MessageSidebar />
      </div>
        <div className='w-[65%] '>
            <EmptyMessages onOpenPopup={() => setIsOpen(true)} />
            <NewMessagePopUP isOpen={isOpen} onClose={() => setIsOpen(false)} />

          
          
        </div>
    </div>
  )
}

export default page