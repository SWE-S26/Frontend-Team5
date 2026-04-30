"use client"
import { useEffect, useState, useMemo } from "react"
import { Avatar } from "antd"
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"
import { useReplies } from "@/hooks/useComments"

import { formatDistanceToNow } from "date-fns"
import { TrackComment } from "@/types/comments.types"
import SortDropdown, { SortOption } from "./SortDropdown"
import { PostCommentPayload } from "@/types/comments.types"
import { useRouter } from "next/navigation"
import { LuSend } from "react-icons/lu"
import { useAppSelector } from "@/store/hooks"
import { CgTrash } from "react-icons/cg"
import ConfirmPopover from "@/components/track/ConfirmPopover"

interface CommentListProps {
  trackId: string
  comments: TrackComment[]
  total: number
  loading: boolean
  loadComments: (trackId: string, reset?: boolean) => Promise<void>
  loadMore: (trackId: string) => void
  toggleLike: (commentId: string) => Promise<void>
  submitComment: (trackId: string, payload: PostCommentPayload, meta?: { displayName: string; avatarUrl: string }) => Promise<any>
  postReply: (trackId: string, payload: PostCommentPayload) => Promise<any>
  deleteCommentById: (commentId: string) => Promise<void>
}

const formatTimestamp = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0")
  const s = (seconds % 60).toString().padStart(2, "0")
  return `${m}:${s}`
}

function ReplySection({
  comment,
  trackId,
  postReply,
  onDeleteComment,
}: {
  comment: TrackComment
  trackId: string
  postReply: (trackId: string, payload: PostCommentPayload) => Promise<any>
  onDeleteComment: (commentId: string) => Promise<void>
}) {
  const router = useRouter()
  const profileImgLink = useAppSelector((state) => state.auth.profileImgLink)
  const { replies, loading, loadReplies, toggleLike, deleteReply } = useReplies()
  const [showReplies, setShowReplies] = useState(false)
  const [replyInput, setReplyInput] = useState("")
  const [showInput, setShowInput] = useState(false)

  const renderContent = (text: string) =>
    text.split(/(@[\w-]+)/g).map((part, i) =>
      /^@[\w-]+$/.test(part) ? (
        <span
          key={i}
          onClick={() => router.push(`/profile/${part.slice(1)}`)}
          className="text-blue-400 hover:text-blue-300 cursor-pointer font-medium"
        >
          {part}
        </span>
      ) : (
        part
      )
    )

  const handleLoadReplies = () => {
    if (!showReplies) loadReplies(comment.commentId)
    setShowReplies((prev) => !prev)
  }

  const handleSubmitReply = async () => {
    if (!replyInput.trim()) return
    await postReply(trackId, {
      content: replyInput,
      timestamp: comment.timestamp,
      parentCommentId: comment.commentId,
    })
    setReplyInput("")
    setShowInput(false)
    setShowReplies(true)
    setTimeout(() => loadReplies(comment.commentId), 300)
  }

  return (
    <div className="flex flex-col gap-2 mt-1">
      <div className="flex items-center gap-3">
        <div className="flex gap-5 items-center">
          <button
            onClick={() => {
              setReplyInput(`@${comment.displayName}: `)
              setShowInput((prev) => !prev)
            }}
            className="text-white font-semibold text-sm hover:text-white w-fit cursor-pointer"
          >
            Reply
          </button>

          {/* Delete top-level comment — only shown if own */}
          
          {comment.isOwnComment && (
            <ConfirmPopover onConfirm={() => onDeleteComment(comment.commentId)}>
              <button
                className="text-gray-500 hover:text-red-500 transition cursor-pointer"
                aria-label="Delete comment"
              >
                <CgTrash size={16} className="text-white mt-2"/>
              </button>
            </ConfirmPopover>
          )}
        </div>

        {comment.replyCount > 0 && (
          <button
            onClick={handleLoadReplies}
            className="text-[#888888] text-sm hover:text-white cursor-pointer"
          >
            {showReplies
              ? "Hide replies"
              : `${comment.replyCount} ${comment.replyCount === 1 ? "reply" : "replies"}`}
          </button>
        )}
      </div>

      {showInput && (
        <div className="flex items-center gap-2 mt-1">
          <Avatar src={profileImgLink || undefined} size={36} style={{ flexShrink: 0 }} />


          <div className="relative flex-1">
            <input
              type="text"
              value={replyInput}
              onChange={(e) => setReplyInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmitReply()}
              placeholder="Write a reply..."
              className="w-full bg-[#303030] text-white text-sm outline-none placeholder-gray-400 px-3 py-2 pr-8 rounded-md"
            />
            <button
              onClick={() => { setShowInput(false); setReplyInput("") }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition cursor-pointer"
              aria-label="Close reply"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <button
            onClick={handleSubmitReply}
            disabled={!replyInput.trim()}
            className="text-sm text-white bg-[#444] px-3 py-2 rounded-md hover:bg-[#555] disabled:opacity-30 cursor-pointer"
          >
            <LuSend size={20} />
          </button>
        </div>
      )}

      {showReplies && (
        <div className="flex flex-col gap-3 mt-2 ml-2 pl-4 border-l-2 border-white/10">
          {loading && <p className="text-gray-400 text-sm">Loading...</p>}
          {replies.map((reply) => (
            <div key={reply.commentId} className="flex gap-3">
              <Avatar src={reply.avatarUrl || undefined} size={36} style={{ flexShrink: 0 }} />


              <div className="flex flex-col flex-1 gap-1">
                <div className="flex items-center gap-1 text-sm">
                  <span className="font-bold text-white">
                    {reply.isOwnComment ? "You" : reply.displayName}
                  </span>
                  <span>at</span>
                  <span className="text-[#888888] font-bold">
                    {formatTimestamp(reply.timestamp)}
                  </span>
                  <span className="text-[#888888]">·</span>
                  <span className="text-[#888888]">
                    {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-white text-sm">{renderContent(reply.content)}</p>

                {/* Delete reply — only shown if own */}
                {reply.isOwnComment && (
                  <ConfirmPopover onConfirm={() => deleteReply(reply.commentId)}>
                    <button
                      className="text-gray-500 hover:text-red-500 transition cursor-pointer w-fit mt-0.5"
                      aria-label="Delete reply"
                    >
                      <CgTrash size={16}  className="text-white"/>
                    </button>
                  </ConfirmPopover>
                )}
              </div>

              <div className="flex flex-col items-center gap-1 text-gray-400 text-sm">
                <button
                  onClick={() => toggleLike(reply.commentId)}
                  className="hover:text-white transition cursor-pointer"
                >
                  {reply.isLikedByUser
                    ? <AiFillHeart size={16} className="text-red-500" />
                    : <AiOutlineHeart size={16} />
                  }
                </button>
                <span>{reply.numLikes}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function CommentList({
  trackId,
  comments,
  total,
  loading,
  loadComments,
  loadMore,
  toggleLike,
  submitComment,
  postReply,
  deleteCommentById,
}: CommentListProps) {
  const hasMore = comments.length < total
  const [sortBy, setSortBy] = useState<SortOption>("Newest")

  useEffect(() => {
    loadComments(trackId)
  }, [trackId])

  const sortedComments = useMemo(() => {
    const copy = [...comments]
    switch (sortBy) {
      case "Newest":
        return copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      case "Oldest":
        return copy.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      case "Track Time":
        return copy.sort((a, b) => a.timestamp - b.timestamp)
      default:
        return copy
    }
  }, [comments, sortBy])

  return (
    <div className="flex flex-col w-full mt-4">

      <div className="flex items-center justify-end gap-55 mb-6 ">
        <h2 className="text-white font-bold text-lg">
          {total.toLocaleString()} comments
        </h2>
        <SortDropdown value={sortBy} onChange={setSortBy} />
      </div>

      <div className="flex flex-col divide-y divide-white/0">
        {sortedComments.map((comment) => (
          <div key={comment.commentId} className="flex gap-4 py-5">
            <Avatar src={comment.avatarUrl || undefined} size={48} style={{ flexShrink: 0 }} />

            <div className="flex flex-col flex-1 gap-1">
              <div className="flex items-center gap-1 text-sm">
                <span className="font-bold text-white">
                  {comment.isOwnComment ? "You" : comment.displayName}
                </span>
                <span>at</span>
                <span className="text-[#888888] font-bold">{formatTimestamp(comment.timestamp)}</span>
                <span className="text-[#888888]">·</span>
                <span className="text-[#888888]">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
              </div>

              <p className="text-white text-sm">{comment.content}</p>

              <ReplySection
                comment={comment}
                trackId={trackId}
                postReply={postReply}
                onDeleteComment={deleteCommentById}
              />
            </div>

            <div className="flex flex-col items-center gap-1 text-gray-400 text-sm">
              <button
                onClick={() => toggleLike(comment.commentId)}
                className="hover:text-white transition cursor-pointer"
              >
                {comment.isLikedByUser
                  ? <AiFillHeart size={18} className="text-red-500" />
                  : <AiOutlineHeart size={18} />
                }
              </button>
              <span>{comment.numLikes}</span>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => loadMore(trackId)}
          disabled={loading}
          className="mt-4 text-sm text-gray-400 hover:text-white transition disabled:opacity-40 cursor-pointer"
        >
          {loading ? "Loading..." : "Load more comments"}
        </button>
      )}
    </div>
  )
}