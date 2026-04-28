import { motion, AnimatePresence } from 'framer-motion'
import { useState , useEffect} from 'react'
import CustomCheckbox from './CustomCheckbox'
import Button from '@/components/ui/Button'
import { IoClose } from "react-icons/io5";

interface BlockPopUpProps {
    isOpen: boolean
    onClose: () => void
    username: string
    onConfirm: () => void
}


const BlockPopUp = ({ isOpen, onClose, username, onConfirm }: BlockPopUpProps) => {
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
                        <IoClose size={16} />
                    </button>
                    <motion.div
                        initial={{ opacity: 0, y: -60 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -60 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className='flex flex-col w-140 p-5 px-8 bg-black rounded-md relative '
                        onClick={(e) => e.stopPropagation()}
                    >
                    <div >
                        <p className='text-xl text-white-smoke font-bold mb-6'>Block {username}</p>
                        <p className='text-sm text-white-smoke font-bold mb-2'>Blocking means that {username} will no longer be able to</p>
                        <ul className='list-disc list-inside text-white-smoke mb-5 ml-7 text-sm'>
                            <li>Follow you,</li>
                            <li>like your tracks,</li>
                            <li>repost your tracks,</li> 
                            <li>send you messages,</li> 
                            <li>share tracks with you,</li> 
                            <li>post new comments on your tracks, or</li> 
                            <li>send you new stream or email notifications.</li>    
                        </ul>

                    <div className='flex flex-col gap-4 mb-8'>
                            <CustomCheckbox
                                checked={removeContent}
                                onChange={setRemoveContent}
                                label="Also permanently remove this user's comments, reposts and likes of your tracks and playlists"
                            />
                            <CustomCheckbox
                                checked={reportSpam}
                                onChange={setReportSpam}
                                label={`Also report ${username} for spam`}
                            />
                        </div>
                    </div>
                    <div className='flex gap-2 ml-auto'>
                        <Button onClick={onClose} className=' bg-off-black'>
                            Cancel
                        </Button>
                        <Button onClick={onConfirm} className=' bg-white-smoke text-chinese-black'>
                            Block {username}
                        </Button>
                    </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export default BlockPopUp