"use client"
import { useEffect } from "react"
import { Avatar } from "antd"
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"
import { useComments } from "@/hooks/useComments"
import { useAppSelector } from "@/store/hooks"
import { formatDistanceToNow } from "date-fns"

interface CommentListProps {
  trackId: string
}

const formatTimestamp = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0")
  const s = (seconds % 60).toString().padStart(2, "0")
  return `${m}:${s}`
}

export default function CommentList({ trackId }: CommentListProps) {
  const { loadComments, loadMore, toggleLike } = useComments()
  const comments = useAppSelector((s) => s.comments.comments)
  const total    = useAppSelector((s) => s.comments.total)
  const loading  = useAppSelector((s) => s.comments.loading)
  const hasMore  = comments.length < total

  useEffect(() => {
    loadComments(trackId)
  }, [trackId])

  return (
    <div className="flex flex-col w-full mt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-bold text-lg">
          {total.toLocaleString()} comments
        </h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white text-sm rounded">
          Sorted by: Newest
          <span>▾</span>
        </button>
      </div>

      {/* Comments */}
      <div className="flex flex-col divide-y divide-white/5">
        {comments.map((comment) => (
          <div key={comment.commentId} className="flex gap-4 py-5">
            {/* Avatar */}
            <Avatar
              src={comment.avatarUrl}
              size={48}
              style={{ flexShrink: 0 }}
            />

            {/* Content */}
            <div className="flex flex-col flex-1 gap-1">
              <div className="flex items-center gap-1 text-sm">
                <span className="font-semibold text-white">{comment.displayName}</span>
                <span>at</span>
                <span className="text-gray-500 font-medium">
                  {formatTimestamp(comment.timestamp)}
                </span>
                <span className="text-gray-500">·</span>
                <span className="text-gray-500">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
              </div>

              <p className="text-white text-sm">{comment.content}</p>

              <button className="text-white font-semibold text-sm hover:text-white w-fit mt-1 cursor-pointer">
                Reply
              </button>
            </div>

            {/* Like */}
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

      {/* Load more */}
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