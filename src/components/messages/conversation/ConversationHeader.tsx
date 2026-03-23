'use client'
import Link from 'next/link'
import { useState } from 'react'
import BlockButton from './BlockButton'
import ReportButton from './ReportButton'
import NewMessagePopUP from '../NewMessagePopUP'
import { FaRegTrashCan } from "react-icons/fa6";

interface ConversationHeaderProps {
    username: string
    userId: string
}


const ConversationHeader = ({ username, userId }: ConversationHeaderProps) => {
    const [OpenBlock, setOpenBlock] = useState(false)
    const[OpenReport, setIsOpenReport] = useState(false)
    return (
        <div className='flex justify-between mb-4'>
            <div className='flex'>
                <Link href={`/profile/${userId}`} className='text-md font-bold text-white-smoke px-2 py-2 hover:text-silver'>
                    {username}
                </Link>
                <BlockButton onClick={() => setOpenBlock(true)} />
                <ReportButton onClick={() => setIsOpenReport(true)} />
            </div>
            <NewMessagePopUP isOpen={OpenBlock} onClose={() => setOpenBlock(false)} />
            <NewMessagePopUP isOpen={OpenReport} onClose={() => setIsOpenReport(false)} />
            <div className='flex'>
                <button className='text-[13px] font-bold bg-off-black rounded-md h-8 w-33 py-1 text-white-smoke hover:text-silver mr-2 '>
                    Mark as unread
                </button>
                <button className='flex items-center justify-center bg-off-black rounded-md h-8 w-10 transition-colors relative group/delete '>
                    <FaRegTrashCan size={14} className='text-white hover:text-silver cursor-pointer' />
                    <div className='absolute bottom-[-2.2rem] left-1/2 -translate-x-1/2 bg-off-black text-white text-[8px] font-medium px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover/delete:opacity-100 transition-opacity pointer-events-none'>
                        Archive this conversation
                        <div className='absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-off-black rotate-45 ' />
                    </div>
                </button>
            </div>
        </div>
    )
}

export default ConversationHeader