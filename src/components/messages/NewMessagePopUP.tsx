'use client'
import React from 'react'
import SendButton from './SendButton'
import { motion, AnimatePresence } from 'framer-motion'

interface NewMessagePopUPProps {
    isOpen: boolean
    onClose: () => void
}

const NewMessagePopUP = ({ isOpen, onClose }: NewMessagePopUPProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className='fixed inset-0 bg-white/30 z-[1001] flex items-start pt-25 justify-center' onClick={onClose}>
                    <motion.div
                        initial={{ opacity: 0, y: -60 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -60 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className='flex flex-col w-200 p-6 bg-black rounded-md relative'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className='absolute -top-8 -right-65 text-white text-2xl font-bold bg-off-black rounded-full w-11 h-11 flex items-center justify-center z-[1001] hover:text-silver cursor-pointer' onClick={onClose}>✕</button>
                        <p className='text-2xl text-white font-bold mb-8'>New message</p>
                        <div className='flex flex-col gap-3 mb-7'>
                            <p className='text-md font-bold text-white'>To<span className='text-red-500'>*</span></p>
                            <textarea className="w-full h-12 bg-off-black px-3 py-3 text-white rounded resize-none caret-crusta text-md 
                                                whitespace-nowrap overflow-x-auto [&::-webkit-scrollbar]:hidden 
                                                [&::-webkit-scrollbar]:w-0 border-r-[12px] border-r-transparent border-l-[12px] border-l-transparent" />
                        </div>
                        <div className='flex flex-col gap-3 mb-5'>
                            <p className='text-md font-bold text-white'>Write your message and add tracks or playlists<span className='text-red-500'>*</span></p>
                            <textarea className="w-full h-29 bg-off-black px-3 py-3 text-white rounded resize-y caret-crusta text-md" />
                        </div>
                        <div className='ml-auto'>
                            <SendButton />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export default NewMessagePopUP