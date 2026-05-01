import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CustomCheckbox from './CustomCheckbox'
import Button from '@/components/ui/Button'

interface ArchivePopUpProps {
  isOpen:    boolean
  onClose:   () => void
  onConfirm: () => void
}

const ArchivePopUp = ({ isOpen, onClose, onConfirm }: ArchivePopUpProps) => {
  const [reportSpam, setReportSpam] = useState(false)

  useEffect(() => {
    if (!isOpen) setReportSpam(false)
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Invisible backdrop to close on outside click */}
          <div
            className='fixed inset-0 z-40'
            onClick={onClose}
          />

          {/* Popover — positioned absolutely relative to the trash button's parent */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className='fixed left-3 right-3 top-20 z-50 w-auto p-5 bg-chinese-black rounded-md shadow-2xl sm:absolute sm:right-0 sm:left-auto sm:top-12 sm:w-82'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Arrow pointing up toward the trash icon */}
            <div className='absolute -top-2 right-3 hidden h-4 w-4 bg-chinese-black rotate-45 sm:block' />

            <p className='text-white-smoke font-bold text-base mb-2'>Are you sure?</p>
            <p className='text-white-smoke text-xs mb-5 leading-snug'>
              Archiving a conversation removes it from your messages and will be restored if you contact this user again.
            </p>

            <div className='mb-5'>
              <CustomCheckbox
                checked={reportSpam}
                onChange={setReportSpam}
                label='Also report conversation as spam'
              />
            </div>

            <div className='flex justify-end gap-2'>
              <Button onClick={onClose} className='bg-off-black text-white-smoke text-sm'>
                Cancel
              </Button>
              <Button onClick={onConfirm} className='bg-white-smoke text-chinese-black text-sm font-bold'>
                Archive
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ArchivePopUp
