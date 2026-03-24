import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import SpamPopUp from './SpamPopUp'
import { useState } from 'react'

interface ReportPopUpProps {
    isOpen: boolean
    onClose: () => void
    onSpam: () => void
    
}

const ReportPopUp = ({ isOpen, onClose, onSpam}: ReportPopUpProps) => {

    const [isSpamOpen, setIsSpamOpen] = useState(false)
    return (
        <AnimatePresence>
        {isOpen && (
            <div className='fixed inset-0 bg-white-smoke/30 z-1001 flex items-start pt-20 justify-center' onClick={onClose}>
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
                className='flex flex-col w-160 p-6 bg-chinese-black rounded-md relative'
                onClick={(e) => e.stopPropagation()}
            >
                {/* Title */}
                <h2 className='text-2xl text-white-smoke font-bold mb-6'>Report account for</h2>

                {/* Report options */}
                <div className='flex flex-col gap-2 mb-10 ml-4'>
                <button
                
                onClick={() => {
                            onSpam()
                        }}
                    className='text-blue-400 hover:underline text-sm w-fit cursor-pointer'
                >
                    Spam
                </button>
                
                <Link href='/report/impersonation' className='text-blue-400 hover:underline text-sm w-fit'>
                    Impersonation
                </Link>
                <Link href='/report/abuse' className='text-blue-400 hover:underline text-sm w-fit'>
                    Abuse
                </Link>
                <Link href='/report/trademark' className='text-blue-400 hover:underline text-sm w-fit'>
                    Trademark infringement
                </Link>
                <Link href='/report/other' className='text-blue-400 hover:underline text-sm w-fit'>
                    Other
                </Link>
                </div>

                {/* Disclaimer */}
                <div className='flex flex-col gap-3'>
                <p className='text-white-smoke font-bold text-md'>Disclaimer</p>
                <p className='text-white-smoke text-[13px]'>
                    Reported accounts are reviewed by a specialist team who take action if the account's
                    content or activity violates our{' '}
                    <Link href='/legal' className='text-blue-400 hover:underline'>
                    Guidelines
                    </Link>
                    {' '}or{' '}
                    <Link href='/legal' className='text-blue-400 hover:underline'>
                    Terms
                    </Link>
                    . Repeated violation or serious breaches can result in the permanent deletion of accounts.
                </p>
                </div>
            </motion.div>
            </div>
        )}
    </AnimatePresence>
  )
}

export default ReportPopUp