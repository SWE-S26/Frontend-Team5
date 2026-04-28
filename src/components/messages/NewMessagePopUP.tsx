"use client"
import SendButton from './SendButton'
import { motion, AnimatePresence } from 'framer-motion'
import { IoClose } from "react-icons/io5";

interface NewMessagePopUPProps {
    isOpen: boolean
    onClose: () => void
}

const NewMessagePopUP = ({ isOpen, onClose }: NewMessagePopUPProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className='fixed inset-0 bg-white/30 z-1001 flex items-start pt-25 justify-center' onClick={onClose}>
                    <button 
                        className='fixed top-4 right-4 text-white-smoke text-2xl font-bold bg-off-black rounded-full w-11 h-11 flex items-center justify-center hover:text-silver cursor-pointer z-1002' 
                        onClick={onClose}
                    >
                        <IoClose size={16} />
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
                            <p className='text-md font-bold text-white-smoke'>To<span className='text-red-500'>*</span></p>
                            <textarea className="w-full h-12 bg-off-black px-3 py-3 text-white-smoke rounded resize-none caret-crusta text-md 
                                                whitespace-nowrap overflow-x-auto [&::-webkit-scrollbar]:hidden 
                                                [&::-webkit-scrollbar]:w-0 border-r-12 border-r-transparent border-l-12 border-l-transparent" />
                        </div>
                        <div className='flex flex-col gap-3 mb-5'>
                            <p className='text-md font-bold text-white-smoke'>Write your message and add tracks or playlists<span className='text-red-500'>*</span></p>
                            <textarea className="w-full h-29 bg-off-black px-3 py-3 text-white-smoke rounded resize-y caret-crusta text-md" />
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