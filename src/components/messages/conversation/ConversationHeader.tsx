'use client'
import Link from 'next/link'
import { useState } from 'react'
import NewMessagePopUP from '../NewMessagePopUP'
import { FaRegTrashCan } from "react-icons/fa6";
import Button from '@/components/ui/Button'
import BlockPopUp from './BlockPopUp';
import ReportPopUp from './ReportPopUp';
import SpamPopUp from './SpamPopUp';

interface ConversationHeaderProps {
    username: string
    userId: string
    markAsUnread: (userId: string) => void
    markAsRead: (userId: string) => void
}


const ConversationHeader = ({ username, userId , markAsUnread, markAsRead }: ConversationHeaderProps) => {
    const [OpenBlock, setOpenBlock] = useState(false)
    const[OpenReport, setIsOpenReport] = useState(false)
    const [isBlocked, setIsBlocked] = useState(false)
    const [isSpamOpen, setIsSpamOpen] = useState(false)
    const [isUnread, setIsUnread] = useState(false)
    return (
        <div className='flex justify-between mb-4'>
            <div className='flex'>
                <Link href={`/profile/${userId}`} className='text-md font-bold text-white-smoke px-2 py-2 hover:text-silver'>
                    {username}
                </Link>

                <Button
                    onClick={() => {
                        if (isBlocked) {
                            setIsBlocked(false)
                        } else {
                            setOpenBlock(true)
                        }
                    }}
                    className={isBlocked ? 'text-crusta bg-chinese-black' : 'bg-chinese-black'}
                >
                    {isBlocked ? 'Blocked' : 'Block'}
                </Button>

                <Button  onClick={() => setIsOpenReport(true)} className='bg-chinese-black' >
                    Report
                </Button>
            </div>



            <BlockPopUp isOpen={OpenBlock} onClose={() => setOpenBlock(false)} username={username} 
                    onConfirm={() => {
                    setIsBlocked(true)
                    setOpenBlock(false)
                }}/>

            <ReportPopUp 
                    isOpen={OpenReport} 
                    onClose={() => setIsOpenReport(false)} 
                    onSpam={() => {
                        setIsOpenReport(false)
                        setIsSpamOpen(true)
                    }}
                />
                <SpamPopUp 
                    isOpen={isSpamOpen} 
                    onClose={() => setIsSpamOpen(false)} 
                    username={username} 
                />


            <div className='flex'>
                <Button className='font-bold bg-off-black  mr-2 ' onClick={() => {
                    if (isUnread) {
                        markAsRead(userId)
                    } else {
                        markAsUnread(userId)
                    }
                    setIsUnread(prev => !prev)
                }}>

                    {isUnread ? 'Mark as read' : 'Mark as unread'}
                </Button>
                <button className='flex items-center justify-center bg-off-black rounded-md h-10 w-10 transition-colors relative group/delete '>
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