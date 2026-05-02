"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import TabsButton from "../ui/TabsButton"
import { useAppSelector } from "@/store/hooks"
import { profileService } from "@/services/profile.service"
import { useSendMessage } from "@/hooks/sockets/useMessaging"
import { useMessagesContext } from "@/components/messages/MessagesContext"
import { messageToastBus } from "@/lib/sockets/messageToastBus"
import { useSearch } from "@/hooks/useSearch"
import { useGetProfile } from "@/hooks/useProfile"
import useDebounce from "@/hooks/useDebounce"
import Button from "@/components/ui/Button"

import { FaTwitter } from "react-icons/fa"
import { FaFacebook } from "react-icons/fa"
import { FaTumblr } from "react-icons/fa"
import { FaPinterest } from "react-icons/fa"
import { HiOutlineMail } from "react-icons/hi"
import { IoClose } from "react-icons/io5"

interface PrefilledUser {
  userId: string
  displayName: string
  photoUrl: string
}

type SearchStatus = 'idle' | 'searching' | 'found' | 'not_found'

interface UserSuggestionItemProps {
  userId:      string
  displayName: string
  onClick:     (user: PrefilledUser) => void
}

function UserSuggestionItem({ userId, displayName, onClick }: UserSuggestionItemProps) {
  const { getProfile, profile } = useGetProfile()

  useEffect(() => {
    if (userId) getProfile(userId)
  }, [userId])

  const photoUrl = profile?.profileImgLink ?? '/profpic.jpg'

  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => onClick({ userId, displayName, photoUrl })}
      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-off-black transition-colors text-left"
    >
      <img src={photoUrl} alt={displayName} className="w-8 h-8 rounded-full object-cover shrink-0" />
      <span className="text-sm text-white-smoke font-bold">{displayName}</span>
    </button>
  )
}

// ── Main component ──────────────────────────────────────────────────────────

interface SharePopupProps {
  isOpen:            boolean
  onClose:           () => void
  prefilledMessage?: string   // ← copy link URL pre-filled in the message body
}

const SharePopup = ({ isOpen, onClose, prefilledMessage }: SharePopupProps) => {
  const [activeTab, setActiveTab] = useState<"share" | "message">("share")
  const params      = useParams()
  const userId      = params.username as string
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const [profile, setProfile] = useState<any>(null)

  // ── Share tab state ──
  const [shortLink, setShortLink]     = useState("")
  const [isShortened, setIsShortened] = useState(false)

  const fullProfileUrl = profile?.profileLink?.startsWith("http")
    ? profile?.profileLink
    : `https://beatza.me/${profile?.profileLink || ""}`

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

  const shortenLink = async () => {
    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullProfileUrl),
      })
      const data = await res.json()
      setShortLink(data.result_url)
      setIsShortened(true)
    } catch (err) {
      console.error("Failed to shorten link", err)
    }
  }

  // ── Message tab state ──
  const [content, setContent]         = useState(prefilledMessage ?? "")
  const [recipient, setRecipient]     = useState<PrefilledUser | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults]         = useState<{ userId: string; displayName: string }[]>([])
  const [status, setStatus]           = useState<SearchStatus>('idle')

  const debouncedQuery          = useDebounce(searchQuery, 350)
  const { getSuggestions }      = useSearch()
  const { updateFromLocalSend } = useMessagesContext()
  const searchRef               = useRef<HTMLDivElement>(null)

  // Reset when popup closes
  useEffect(() => {
    if (!isOpen) {
      setContent(prefilledMessage ?? "")
      setRecipient(null)
      setSearchQuery("")
      setResults([])
      setStatus('idle')
      setActiveTab("share")
    }
  }, [isOpen])

  // When Message tab is clicked — pre-fill with the URL if content is empty
  const handleMessageTabClick = () => {
    setActiveTab("message")
    setContent((prev) => prev || (prefilledMessage ?? ""))
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!searchRef.current?.contains(e.target as Node)) {
        setStatus((s) => (s === 'found' ? 'idle' : s))
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // Search when debounced query settles
  useEffect(() => {
    if (recipient) return
    if (!debouncedQuery.trim()) { setStatus('idle'); setResults([]); return }

    let cancelled = false
    const run = async () => {
      setStatus('searching')
      try {
        const body = await getSuggestions(debouncedQuery)
        if (cancelled) return

        const raw   = Array.isArray(body) ? body : []
        const users = raw
          .filter((item: any) => {
            const t = String(item.type ?? '').toLowerCase()
            return t === 'user' || t === 'users'
          })
          .map((item: any) => ({
            userId:      String(item.id ?? item._id ?? ''),
            displayName: String(item.title ?? item.displayName ?? ''),
          }))
          .filter((u) => u.userId && u.displayName)

        if (cancelled) return
        if (users.length > 0) { setResults(users); setStatus('found') }
        else                  { setResults([]);     setStatus('not_found') }
      } catch {
        if (!cancelled) setStatus('not_found')
      }
    }

    run()
    return () => { cancelled = true }
  }, [debouncedQuery, recipient, getSuggestions])

  const handleSelectUser = useCallback((user: PrefilledUser) => {
    setRecipient(user)
    setSearchQuery("")
    setResults([])
    setStatus('idle')
  }, [])

  const handleClearRecipient = useCallback(() => {
    setRecipient(null)
    setSearchQuery("")
    setStatus('idle')
  }, [])

  const { send, isSending } = useSendMessage(({ conversation }) => {
    updateFromLocalSend(conversation)
    if (recipient) {
      messageToastBus.emit({
        type:           "sent",
        recipientName:  recipient.displayName,
        recipientPhoto: recipient.photoUrl,
      })
    }
    setContent("")
    setRecipient(null)
    onClose()
  })

  const handleSend = async () => {
    if (!recipient || !content.trim()) return
    await send(recipient.userId, content.trim())
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
            <button
              data-testid="cancel-button-popup"
              className="absolute -top-8 -right-65 text-white text-2xl font-bold bg-off-black rounded-full w-11 h-11 flex items-center justify-center z-[1001] hover:text-silver cursor-pointer"
              onClick={onClose}
            >
              <IoClose size={16} />
            </button>

            <div className="flex gap-6 mb-8">
              <TabsButton
                data-testid="Share-button-Bar"
                href="#" label="Share" pathname=""
                isActiveb={activeTab === "share"}
                onClick={() => setActiveTab("share")}
              />
              <TabsButton
                data-testid="Messages-button-Bar"
                href="#" label="Message" pathname=""
                isActiveb={activeTab === "message"}
                onClick={handleMessageTabClick}
              />
            </div>

            {/* ── Share tab ── */}
            {activeTab === "share" && (
              <>
                <div className="flex gap-4 mb-7">
                  <div className="relative group w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center text-white cursor-pointer" onClick={() => window.open(`https://twitter.com/intent/tweet?url`, "_blank")}>
                    <FaTwitter className="w-7 h-7 group" />
                    <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md bg-[#2C2C2C] text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none shadow-lg z-50">Share on Twitter</span>
                  </div>
                  <div className="relative group w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center text-white cursor-pointer" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u`, "_blank")}>
                    <FaFacebook className="w-7 h-7" />
                    <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md bg-[#2C2C2C] text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none shadow-lg z-50">Share on Facebook</span>
                  </div>
                  <div className="relative group w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-white cursor-pointer" onClick={() => window.open(`https://www.tumblr.com/login`, "_blank")}>
                    <FaTumblr className="w-7 h-7" />
                    <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md bg-[#2C2C2C] text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none shadow-lg z-50">Share on Tumblr</span>
                  </div>
                  <div className="relative group w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white cursor-pointer" onClick={() => window.open(`https://pinterest.com/pin/create/button/?url`, "_blank")}>
                    <FaPinterest className="w-7 h-7" />
                    <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md bg-[#2C2C2C] text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none shadow-lg z-50">Share on Pinterest</span>
                  </div>
                  <div className="relative group w-12 h-12 rounded-full bg-[#303030] flex items-center justify-center text-white cursor-pointer" onClick={() => window.open(`mailto:?subject=Check this out&body`, "_blank")}>
                    <HiOutlineMail className="w-7 h-7 text-silver" />
                    <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md bg-[#2C2C2C] text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none shadow-lg z-50">Share via email</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mb-5">
                  <textarea
                    readOnly
                    value={isShortened ? shortLink : (prefilledMessage ?? fullProfileUrl)}
                    className="w-full h-12 bg-off-black px-3 py-3 text-white rounded resize-none caret-crusta text-md whitespace-nowrap overflow-x-auto [&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar]:w-0 border-r-[12px] border-r-transparent border-l-[12px] border-l-transparent"
                  />
                </div>

                <label className="flex items-center gap-2 text-gray-400 text-sm">
                  <input
                    data-testid="ShortenLink-input"
                    type="checkbox"
                    className="w-5 h-5 border border-gray-400"
                    onChange={(e) => {
                      if (e.target.checked) shortenLink()
                      else setIsShortened(false)
                    }}
                  />
                  Shorten link
                </label>
              </>
            )}

            {/* ── Message tab ── */}
            {activeTab === "message" && (
              <>
                <p className="text-xl text-white-smoke font-bold mb-8">New message</p>

                <div className="flex flex-col gap-2 mb-7">
                  <p className="text-md font-bold text-white-smoke">
                    To<span className="text-red-500">*</span>
                  </p>

                  {recipient ? (
                    <div className="w-full min-h-12 bg-off-black px-3 py-2 rounded flex items-center gap-2">
                      <div className="flex items-center gap-2 bg-chinese-black rounded px-2 py-1">
                        <img src={recipient.photoUrl} alt={recipient.displayName} className="w-6 h-6 rounded-full object-cover" />
                        <span className="text-white-smoke text-sm font-bold">{recipient.displayName}</span>
                        <button onClick={handleClearRecipient} className="text-silver hover:text-white-smoke text-xs ml-1 cursor-pointer">✕</button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative" ref={searchRef}>
                      <input
                        type="text"
                        autoComplete="off"
                        placeholder="Search for a user..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value)
                          if (status !== 'searching') setStatus('idle')
                        }}
                        className={`w-full h-12 bg-off-black px-3 text-white-smoke text-sm rounded outline-none caret-crusta ring-1 transition-all duration-200 ${
                          status === 'not_found' ? 'ring-red-500' : 'ring-transparent focus:ring-silver'
                        }`}
                      />
                      {status === 'not_found' && (
                        <p className="text-red-500 text-xs mt-1">User not found</p>
                      )}
                      {status === 'found' && results.length > 0 && (
                        <ul className="absolute left-0 right-0 bg-chinese-black border border-off-black mt-1 rounded z-50 max-h-60 overflow-auto">
                          {results.map((user) => (
                            <li key={user.userId}>
                              <UserSuggestionItem
                                userId={user.userId}
                                displayName={user.displayName}
                                onClick={handleSelectUser}
                              />
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 mb-5">
                  <p className="text-md font-bold text-white-smoke">
                    Write your message and add tracks or playlists
                    <span className="text-red-500">*</span>
                  </p>
                  <textarea
                    className="w-full h-29 bg-off-black px-3 py-3 text-white-smoke rounded resize-y caret-crusta text-md"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={isSending}
                  />
                </div>

                <div className="ml-auto">
                  <Button
                    data-testid="SendMessage-button"
                    onClick={handleSend}
                    disabled={!recipient || !content.trim() || isSending}
                    className="text-chinese-black text-sm bg-white-smoke disabled:opacity-50"
                  >
                    {isSending ? "Sending..." : "Send"}
                  </Button>
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
