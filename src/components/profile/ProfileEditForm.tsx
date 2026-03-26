"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import AvatarUpload from "./profile-header/AvatarUpload"
import Button from "@/components/ui/Button"
import { useAppSelector } from "@/store/hooks"

interface EditProfilePopUPProps {
  isOpen: boolean
  onClose: () => void
}

const ProfileEditForm = ({ isOpen, onClose }: EditProfilePopUPProps) => {
  // all data comes from profileSlice — populated by ProfileHeader after API fetch
  const profileImgLink  = useAppSelector((state) => state.profile.profileImgLink)
  const displayName     = useAppSelector((state) => state.profile.displayName)
  const firstName       = useAppSelector((state) => state.profile.firstName)
  const lastName        = useAppSelector((state) => state.profile.lastName)
  const profileLink     = useAppSelector((state) => state.profile.profileLink)
  const city            = useAppSelector((state) => state.profile.city)
  const country         = useAppSelector((state) => state.profile.country)
  const bio             = useAppSelector((state) => state.profile.bio)

  const [avatarImage,     setAvatarImage]     = useState<string | null>(null)
  const [formDisplayName, setFormDisplayName] = useState("")
  const [formProfileLink, setFormProfileLink] = useState("")
  const [formFirstName,   setFormFirstName]   = useState("")
  const [formLastName,    setFormLastName]     = useState("")
  const [formCity,        setFormCity]         = useState("")
  const [formCountry,     setFormCountry]      = useState("")
  const [formBio,         setFormBio]          = useState("")

  // when form opens populate all fields from profileSlice
  useEffect(() => {
    if (!isOpen) return
    setAvatarImage(profileImgLink   || null)
    setFormDisplayName(displayName  || "")
    setFormProfileLink(profileLink  || "")
    setFormFirstName(firstName      || "")
    setFormLastName(lastName        || "")
    setFormCity(city                || "")
    setFormCountry(country          || "")
    setFormBio(bio                  || "")
  }, [isOpen, profileImgLink, displayName, profileLink, firstName, lastName, city, country, bio])

  const handleCancel = () => {
    // reset all fields back to current Redux values and close
    setAvatarImage(profileImgLink   || null)
    setFormDisplayName(displayName  || "")
    setFormProfileLink(profileLink  || "")
    setFormFirstName(firstName      || "")
    setFormLastName(lastName        || "")
    setFormCity(city                || "")
    setFormCountry(country          || "")
    setFormBio(bio                  || "")
    onClose()
  }

  const handleSave = () => {
    // API call to save changes will go here
    // dispatch(setProfile({ displayName: formDisplayName, ... })) after API succeeds
    console.log("saving:", {
      formDisplayName,
      formProfileLink,
      formFirstName,
      formLastName,
      formCity,
      formCountry,
      formBio,
      avatarImage,
    })
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-white/30 z-[1001] flex items-start pt-10 justify-center"
          onClick={handleCancel}
        >
          <button
            className="fixed top-4 right-4 text-white-smoke text-2xl font-bold bg-off-black rounded-full w-11 h-11 flex items-center justify-center hover:text-silver cursor-pointer z-[1002]"
            onClick={handleCancel}
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
            <p className="text-xl text-white-smoke font-bold mb-6">
              Edit your Profile
            </p>

            <div className="flex gap-6 mb-4">
              <AvatarUpload
                avatarImage={avatarImage}
                onImageChange={setAvatarImage}
                className="relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gray-400/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
                <Button
                  className={`bg-chinese-black text-white-smoke absolute bottom-9 right-9 cursor-pointer 
                    ${avatarImage ? "opacity-0 group-hover/avatar:opacity-100" : "opacity-100"}`}
                >
                  Upload image
                </Button>
              </AvatarUpload>

              <div className="flex-1 flex flex-col gap-3">

                <div>
                  <p className="text-sm text-white-smoke font-bold mb-1">
                    Display name <span className="text-red-500">*</span>
                  </p>
                  <input
                    value={formDisplayName}
                    onChange={(e) => setFormDisplayName(e.target.value)}
                    className="w-full bg-off-black px-3 py-2 text-white-smoke rounded"
                    placeholder="Display name"
                  />
                </div>

                <div>
                  <p className="text-sm text-white-smoke font-bold mb-1">
                    Profile URL <span className="text-red-500">*</span>
                  </p>
                  <input
                    value={formProfileLink}
                    onChange={(e) => setFormProfileLink(e.target.value)}
                    className="w-full bg-off-black px-3 py-2 text-white-smoke rounded"
                    placeholder="your-profile-link"
                  />
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <p className="text-sm text-white-smoke font-bold mb-1">First name</p>
                    <input
                      value={formFirstName}
                      onChange={(e) => setFormFirstName(e.target.value)}
                      className="w-full bg-off-black px-3 py-2 text-white-smoke rounded"
                      placeholder="First name"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white-smoke font-bold mb-1">Last name</p>
                    <input
                      value={formLastName}
                      onChange={(e) => setFormLastName(e.target.value)}
                      className="w-full bg-off-black px-3 py-2 text-white-smoke rounded"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <p className="text-sm text-white-smoke font-bold mb-1">City</p>
                    <input
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value)}
                      className="w-full bg-off-black px-3 py-2 text-white-smoke rounded"
                      placeholder="City"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white-smoke font-bold mb-1">Country</p>
                    <input
                      value={formCountry}
                      onChange={(e) => setFormCountry(e.target.value)}
                      className="w-full bg-off-black px-3 py-2 text-white-smoke rounded"
                      placeholder="Country"
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm text-white-smoke font-bold mb-1">Bio</p>
                  <textarea
                    value={formBio}
                    onChange={(e) => setFormBio(e.target.value)}
                    className="w-full h-20 bg-off-black px-3 py-2 text-white-smoke rounded resize-none text-sm"
                    placeholder="Tell the world a little bit about yourself. The shorter the better."
                  />
                </div>

              </div>
            </div>

            <p className="text-sm text-white-smoke font-bold mb-2">Your links</p>
            <div className="flex gap-3 mb-5">
              <button className="bg-off-black text-white-smoke px-4 py-2 rounded cursor-pointer">
                Add link
              </button>
              <button className="bg-white text-black px-4 py-2 rounded cursor-pointer">
                Add support link
              </button>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="bg-off-black text-white-smoke px-4 py-2 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-white text-black px-4 py-2 rounded cursor-pointer"
              >
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