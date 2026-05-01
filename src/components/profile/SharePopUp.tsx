"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import TabsButton from "../ui/TabsButton"
import SendButton from "../messages/SendButton"
import { useAppSelector } from "@/store/hooks"
import { profileService } from "@/services/profile.service"


import { FaTwitter } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaTumblr } from "react-icons/fa";
import { FaPinterest } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

interface SharePopupProps {
  isOpen: boolean
  onClose: () => void
}

const SharePopup = ({ isOpen, onClose }: SharePopupProps) => {
    const [activeTab, setActiveTab] = useState<"share" | "message">("share")
    const params = useParams()
    const userId = params.username as string
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
    const [profile, setProfile] = useState<any>(null)

    
      useEffect(() => {
        if (!userId) return

        const fetchProfile = async () => {
          try {
            const data = isAuthenticated
              ? await profileService.getProfileAuthCached(userId)
              : await profileService.getProfileCached(userId)
            setProfile(data)
          } catch (err) {
            console.error("Failed to fetch profile", err)
          }
        }

        fetchProfile()
      }, [userId, isAuthenticated])


    const [shortLink, setShortLink] = useState<string>("")
    const [isShortened, setIsShortened] = useState(false)
    const fullProfileUrl = profile?.profileLink?.startsWith("http") 
    ? profile?.profileLink 
    : `https://beatza.me/${profile?.profileLink || ""}`

   const shortenLink = async () => {
  try {
    const res = await fetch("/api/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fullProfileUrl)
    })
    const data = await res.json()
    console.log("SHORT URL:", data)
    setShortLink(data.result_url)
    console.log("DATA:", data)
    console.log("RESULT URL:", data.result_url)
    setIsShortened(true)
  } catch (err) {
    console.error("Failed to shorten link", err)
  }
}


    
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-white/30 z-[1001] flex items-start pt-25 justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col w-200 p-6 bg-black rounded-md relative"
            onClick={(e) => e.stopPropagation()}
          >
          
            <button data-testid="cancel-button-popup"
              className="absolute -top-8 -right-65 text-white text-2xl font-bold bg-off-black rounded-full w-11 h-11 flex items-center justify-center z-[1001] hover:text-silver cursor-pointer"
              onClick={onClose}
            >
              <IoClose size={16} />
            </button>

            <div className="flex gap-6 mb-8">
              <TabsButton data-testid="Share-button-Bar"
                    href="#"
                    label="Share"
                    pathname=""
                    isActiveb={activeTab === "share"}
                    onClick={() => setActiveTab("share")}
                />

                <TabsButton data-testid="Messages-button-Bar"
                    href="#"
                    label="Message"
                    pathname=""
                    isActiveb={activeTab === "message"}
                    onClick={() => setActiveTab("message")}
                />
            </div>
{activeTab === "share" && (
              <>
                {/* icons */}
                <div className="flex gap-4 mb-7">
                  <div className="relative group w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center text-white cursor-pointer" onClick={() => window.open(`https://twitter.com/intent/tweet?url`, "_blank")}>
                    <FaTwitter className="w-7 h-7 group" />
                    <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md bg-[#2C2C2C] text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none shadow-lg z-50">
                        Share on Twitter
                    </span>
                  </div>
                  <div className="relative group w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center text-white cursor-pointer"
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u`, "_blank")}>
                    <FaFacebook className="w-7 h-7" />
                    <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md bg-[#2C2C2C] text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none shadow-lg z-50">
                        Share on Facebook
                    </span>
                  </div>
                  <div className="relative group w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-white cursor-pointer"
                    onClick={() => window.open(`https://www.tumblr.com/login`, "_blank")}>
                    <FaTumblr className="w-7 h-7" />
                    <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md bg-[#2C2C2C] text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none shadow-lg z-50">
                        Share on Tumblr
                    </span>
                  </div>
                 <div className="relative group w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white cursor-pointer"
                    onClick={() => window.open(`https://pinterest.com/pin/create/button/?url`, "_blank")}>
                    <FaPinterest className="w-7 h-7" />
                    <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md bg-[#2C2C2C] text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none shadow-lg z-50">
                        Share on Pinterest
                    </span>
                  </div>
                  <div className="relative group w-12 h-12 rounded-full bg-[#303030] flex items-center justify-center text-white cursor-pointer"
                    onClick={() => window.open(`mailto:?subject=Check this out&body`, "_blank")}>
                    <HiOutlineMail className="w-7 h-7 text-silver" />
                    <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md bg-[#2C2C2C] text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none shadow-lg z-50">
                        Share via email
                    </span>
                  </div>
                </div>

                {/* Link input */}
                <div className="flex flex-col gap-3 mb-5">
                  <textarea
                    readOnly
                    value={isShortened ? shortLink : fullProfileUrl }
                    
                    className="w-full h-12 bg-off-black px-3 py-3 text-white rounded resize-none caret-crusta text-md 
                    whitespace-nowrap overflow-x-auto [&::-webkit-scrollbar]:hidden 
                    [&::-webkit-scrollbar]:w-0 border-r-[12px] border-r-transparent border-l-[12px] border-l-transparent"
                  />
                </div>

                {/* Checkbox */}
                <label className="flex items-center gap-2 text-gray-400 text-sm">
                  <input  data-testid="ShortenLink-input"
                    type="checkbox" 
                    className="w-5 h-5 border border-gray-400"
                    onChange={(e) => {
                    if (e.target.checked) {
                        shortenLink()
                    } else {
                        setIsShortened(false)
                    }
                    }}
                />
                  Shorten link
                </label>
              </>
            )}

            {activeTab === "message" && (
              <>
                
                <p className="text-2xl text-white font-bold mb-8">New message</p>

                <div className="flex flex-col gap-3 mb-7">
                  <p className="text-md font-bold text-white">
                    To<span className="text-red-500">*</span>
                  </p>
                  <textarea
                    className="w-full h-12 bg-off-black px-3 py-3 text-white rounded resize-none caret-crusta text-md 
                    whitespace-nowrap overflow-x-auto [&::-webkit-scrollbar]:hidden 
                    [&::-webkit-scrollbar]:w-0 border-r-[12px] border-r-transparent border-l-[12px] border-l-transparent"
                  />
                </div>

                <div className="flex flex-col gap-3 mb-5">
                  <p className="text-md font-bold text-white">
                    Write your message and add tracks or playlists
                    <span className="text-red-500">*</span>
                  </p>
                  <textarea className="w-full h-29 bg-off-black px-3 py-3 text-white rounded resize-y caret-crusta text-md" />
                </div>

                <div className="ml-auto">
                  <SendButton  data-testid="SendMessage-button"/>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default SharePopup