"use client"
import { useState } from "react"
import { Avatar } from "antd"
import { LuSend } from "react-icons/lu"
import { useAppSelector } from "@/store/hooks"
import { PostCommentPayload } from "@/types/comments.types"

interface CommentInputProps {
  trackId: string
  loading: boolean
  currentTime: number
  submitComment: (trackId: string, payload: PostCommentPayload, meta?: { displayName: string; avatarUrl: string }) => Promise<any>
}

export default function CommentInput({ trackId, submitComment, loading, currentTime }: CommentInputProps) {

  const [comment, setComment] = useState("")
  const profileImgLink = useAppSelector((state) => state.auth.profileImgLink)
  const displayName    = useAppSelector((state) => state.auth.displayName)

  const handleSubmit = async () => {
    if (!comment.trim() || loading) return
    await submitComment(trackId, {
      content: comment,
      timestamp: Math.floor(currentTime), 
    }, {
      displayName: displayName ?? "",
      avatarUrl:   profileImgLink ?? "",
    })
    setComment("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit()
  }

  return (
    <div className="flex flex-col w-full border-t border-white-smoke/10">
      <div className="flex items-center gap-3 w-full py-3">
        <Avatar
          src={profileImgLink ?? undefined}
          size={36}
          style={{ flexShrink: 0 }}
        />


        <div className="flex-1 flex items-center bg-off-black border-none rounded-md h-10">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a comment"
            className="flex-1 bg-transparent text-white-smoke text-sm outline-none placeholder-silver px-4 h-full"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!comment.trim() || loading}
          className="w-10 h-10 flex items-center justify-center bg-off-black border-none rounded-md  hover:text-white-smoke transition disabled:opacity-30 cursor-pointer"
        >
          <LuSend size={20} />
        </button>
      </div>
    </div>
  )
}