import { motion, AnimatePresence } from 'framer-motion'
import { useState , useEffect} from 'react'
import CustomCheckbox from './CustomCheckbox'
import Button from '@/components/ui/Button'

interface SpamPopUpProps {
    isOpen: boolean
    onClose: () => void
    username: string
   
}


const SpamPopUp = ({ isOpen, onClose, username }: SpamPopUpProps) => {
    const [removeContent, setRemoveContent] = useState(false)
    const [reportSpam, setReportSpam] = useState(false)

    useEffect(() => {
        if (!isOpen) {
            setRemoveContent(false)
            setReportSpam(false)
        }
    }, [isOpen])

  return (
    <AnimatePresence>
            {isOpen && (
                <div className='fixed inset-0 bg-white-smoke/30 z-1001 flex items-start pt-20 justify-center ' onClick={onClose}>
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
                        className='flex flex-col w-160 p-5 px-8 bg-black rounded-md relative '
                        onClick={(e) => e.stopPropagation()}
                    >
                   
                        <p className='text-xl text-white-smoke font-bold mb-6'>Report Spam</p>
                        <p className='text-sm text-white-smoke font-bold mb-2'>Reporting {username} for spam: </p>
                        <ul className='list-disc list-inside text-white-smoke mb-5 ml-7 text-sm'>
                            <li>Removes their comments, reposts and likes from your tracks and playlists</li>
                            <li>Blocks them from interacting with you</li>
                            <li>Sends SoundCloud a spam report</li>
                        </ul>


                        <div className='flex gap-2 ml-auto'>
                        <Button onClick={onClose} className=' bg-off-black'>
                            Cancel
                        </Button>
                        <Button onClick={onClose} className=' bg-white-smoke text-chinese-black'>
                            Report Spam
                        </Button>
                    </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export default SpamPopUp