"use client"
import { useEffect, useState, useMemo } from "react"
import { Avatar } from "antd"
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"
import { useReplies } from "@/hooks/useComments"
import { formatDistanceToNow } from "date-fns"
import { TrackComment } from "@/types/comments.types"
import SortDropdown, { SortOption } from "./SortDropdown"

interface CommentListProps {
  trackId: string
  comments: TrackComment[]
  total: number
  loading: boolean
  loadComments: (trackId: string, reset?: boolean) => Promise<void>
  loadMore: (trackId: string) => void
  toggleLike: (commentId: string) => Promise<void>
}

const formatTimestamp = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0")
  const s = (seconds % 60).toString().padStart(2, "0")
  return `${m}:${s}`
}

export default function CommentList({ trackId, comments, total, loading, loadComments, loadMore, toggleLike }: CommentListProps) {
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-bold text-lg">
          {total.toLocaleString()} comments
        </h2>
        <SortDropdown value={sortBy} onChange={setSortBy} />
      </div>

      <div className="flex flex-col divide-y divide-white/0">
        {sortedComments.map((comment) => (
          <div key={comment.commentId} className="flex gap-4 py-5">
            <Avatar src={comment.avatarUrl} size={48} style={{ flexShrink: 0 }} />

            <div className="flex flex-col flex-1 gap-1">
              <div className="flex items-center gap-1 text-sm">
                <span className="font-bold text-white">{comment.displayName}</span>
                <span>at</span>
                <span className="text-[#888888] font-bold">{formatTimestamp(comment.timestamp)}</span>
                <span className="text-[#888888]">·</span>
                <span className="text-[#888888]">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
              </div>

              <p className="text-white text-sm">{comment.content}</p>

              <button className="text-white font-semibold text-sm hover:text-white w-fit mt-1 cursor-pointer">
                Reply
              </button>
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