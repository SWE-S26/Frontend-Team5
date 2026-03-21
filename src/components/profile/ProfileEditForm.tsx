"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import AvatarUpload from "./profile-header/AvatarUpload"
import Button from "@/components/ui/Button"

interface EditProfilePopUPProps {
  isOpen: boolean
  onClose: () => void
}

const ProfileEditForm = ({ isOpen, onClose }: EditProfilePopUPProps) => {
    const [avatarImage, setAvatarImage] = useState<string | null>(null)
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-white/30 z-[1001] flex items-center justify-center overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col w-[800px] h-[100px] overflow-y-auto p-6 bg-black rounded-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute -top-8 -right-65 text-white text-2xl font-bold bg-off-black rounded-full w-11 h-11 flex items-center justify-center z-[1001] hover:text-silver cursor-pointer"
              onClick={onClose}
            >
              ✕
            </button>

            {/* Title */}
            <p className="text-2xl text-white font-bold mb-6">
              Edit your Profile
            </p>

            {/* Top Section */}
            <div className="flex gap-6 mb-6">

              {/* Avatar */}
              
              <AvatarUpload
                onImageChange={setAvatarImage}
                className="relative overflow-hidden">

                <div className="absolute inset-0 bg-gray-400/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity"></div>

                <Button
                    className={`bg-chinese-black text-white-smoke absolute bottom-9 right-9 cursor-pointer 
                        ${avatarImage ? "opacity-0 group-hover/avatar:opacity-100" : "opacity-100"
                    }`}
                    >
                    Upload image
                </Button>

                </AvatarUpload>

              {/* Form */}
              <div className="flex-1 flex flex-col gap-5">

                {/* Display Name */}
                <div>
                  <p className="text-sm text-white font-bold mb-2">
                    Display name <span className="text-red-500">*</span>
                  </p>
                  <input
                    className="w-full bg-off-black px-3 py-2 text-white rounded"
                    placeholder="Display name"
                  />
                </div>

                {/* Profile URL */}
                <div>
                  <p className="text-sm text-white font-bold mb-2">
                    Profile URL <span className="text-red-500">*</span>
                  </p>
                  <input
                    className="w-full bg-off-black px-3 py-2 text-white rounded"
                    placeholder="your-profile-link"
                  />
                </div>

                {/* Names */}
                <div className="flex gap-2 w-full">
                <div>
                  <p className="text-sm text-white font-bold mb-2">
                    First name 
                  </p>
                  <input
                    className="w-full bg-off-black px-3 py-2 text-white rounded"
                    placeholder="First name"
                  />
                </div>

                <div>
                  <p className="text-sm text-white font-bold mb-2">
                    Last name 
                  </p>
                  <input
                    className="w-full bg-off-black px-3 py-2 text-white rounded"
                    placeholder="Last name"
                  />
                </div>
                </div>

                {/* Location */}
                <div className="flex gap-2 w-full">
                <div>
                  <p className="text-sm text-white font-bold mb-2">
                    City
                  </p>
                  <input
                    className="w-full bg-off-black px-3 py-2 text-white rounded"
                    placeholder="First name"
                  />
                </div>

                <div>
                  <p className="text-sm text-white font-bold mb-2">
                    Country 
                  </p>
                  <input
                    className="w-full bg-off-black px-3 py-2 text-white rounded"
                    placeholder="Last name"
                  />
                </div>
                
                </div>
                {/* Bio */}
                    <div className="mb-6">
                    <p className="text-sm text-white font-bold mb-1">Bio</p>
                    <textarea
                        className="w-full text-sm  h-24 bg-off-black px-3 py-2 text-white rounded "
                        placeholder="Tell the world a little bit about yourself. The shorter the better."
                    />
                    </div>

              </div>
            </div>

            

            {/* Links */}
            <p className="text-sm text-white font-bold mb-1">Your links</p>
            <div className="flex gap-3 mb-6">
              <button className="bg-off-black text-white px-4 py-2 rounded">
                Add link
              </button>
              <button className="bg-white text-black px-4 py-2 rounded">
                Add support link
              </button>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="bg-off-black text-white px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button className="bg-white text-black px-4 py-2 rounded">
                Save changes
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ProfileEditForm