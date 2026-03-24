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
          className="fixed inset-0 bg-white/30 z-[1001] flex items-start pt-10 justify-center"
          onClick={onClose}
        >
          <button
            className="fixed top-4 right-4 text-white-smoke text-2xl font-bold bg-off-black rounded-full w-11 h-11 flex items-center justify-center hover:text-silver cursor-pointer z-[1002]"
            onClick={onClose}
          >
            ✕
          </button>

          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col w-200 p-6 bg-black rounded-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title */}
            <p className="text-xl text-white-smoke font-bold mb-6">
              Edit your Profile
            </p>

            {/* Top Section */}
            <div className="flex gap-6 mb-4">
              {/* Avatar */}
              <AvatarUpload
                onImageChange={setAvatarImage}
                className="relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gray-400/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity"></div>
                <Button
                  className={`bg-chinese-black text-white-smoke absolute bottom-9 right-9 cursor-pointer 
                    ${avatarImage ? "opacity-0 group-hover/avatar:opacity-100" : "opacity-100"}`}
                >
                  Upload image
                </Button>
              </AvatarUpload>

              {/* Form Fields */}
              <div className="flex-1 flex flex-col gap-3">

                {/* Display Name */}
                <div>
                  <p className="text-sm text-white-smoke font-bold mb-1">
                    Display name <span className="text-red-500">*</span>
                  </p>
                  <input
                    className="w-full bg-off-black px-3 py-2 text-white-smoke rounded"
                    placeholder="Display name"
                  />
                </div>

                {/* Profile URL */}
                <div>
                  <p className="text-sm text-white-smoke font-bold mb-1">
                    Profile URL <span className="text-red-500">*</span>
                  </p>
                  <input
                    className="w-full bg-off-black px-3 py-2 text-white-smoke rounded"
                    placeholder="your-profile-link"
                  />
                </div>

                {/* Names */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <p className="text-sm text-white-smoke font-bold mb-1">First name</p>
                    <input
                      className="w-full bg-off-black px-3 py-2 text-white-smoke rounded"
                      placeholder="First name"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white-smoke font-bold mb-1">Last name</p>
                    <input
                      className="w-full bg-off-black px-3 py-2 text-white-smoke rounded"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <p className="text-sm text-white-smoke font-bold mb-1">City</p>
                    <input
                      className="w-full bg-off-black px-3 py-2 text-white-smoke rounded"
                      placeholder="City"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white-smoke font-bold mb-1">Country</p>
                    <input
                      className="w-full bg-off-black px-3 py-2 text-white-smoke rounded"
                      placeholder="Country"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <p className="text-sm text-white-smoke font-bold mb-1">Bio</p>
                  <textarea
                    className="w-full h-20 bg-off-black px-3 py-2 text-white-smoke rounded resize-none text-sm"
                    placeholder="Tell the world a little bit about yourself. The shorter the better."
                  />
                </div>

              </div>
            </div>

            {/* Links */}
            <p className="text-sm text-white-smoke font-bold mb-2">Your links</p>
            <div className="flex gap-3 mb-5">
              <button className="bg-off-black text-white-smoke px-4 py-2 rounded cursor-pointer">
                Add link
              </button>
              <button className="bg-white text-black px-4 py-2 rounded cursor-pointer">
                Add support link
              </button>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="bg-off-black text-white-smoke px-4 py-2 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button className="bg-white text-black px-4 py-2 rounded cursor-pointer">
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