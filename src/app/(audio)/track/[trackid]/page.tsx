"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

import TrackHeader from "@/components/track/TrackHeader"
import Navbar from "@/components/layout/navbar/main-navbar/Navbar"
import TrackSidebar from "@/components/track/TrackSidebar"
import CommentInput from "@/components/track/CommentInput"
import CommentListProps from "@/components/track/CommentListProps"
import Uploader from "@/components/track/Uploader"

import { useGetTrackById } from "@/hooks/useTracks"
import { useStatelessComments } from "@/hooks/useComments"

export default function Track() {
  const { trackid } = useParams<{ trackid: string }>()

  const { getTrackById, track, loading, error } = useGetTrackById()
  const { comments, total, loading: commentsLoading, loadComments, loadMore, submitComment, toggleLike } = useStatelessComments()

  const [posterId, setPosterId] = useState<string | null>(null)

  useEffect(() => {
    if (!trackid) return
    getTrackById(trackid)
  }, [trackid])

  useEffect(() => {
    if (track?.posterId) {
      setPosterId(track.posterId)
    }
  }, [track])

  if (loading) return <div className="text-white">Loading...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div>
      <Navbar />

      <TrackHeader trackId={trackid} />

      <div className="flex w-[80%] justify-between gap-8 mx-auto">
        <div className="flex-1">
          <CommentInput trackId={trackid} submitComment={submitComment} loading={commentsLoading} />
          {posterId && <Uploader posterId={posterId} />}
          <CommentListProps
            trackId={trackid}
            comments={comments}
            total={total}
            loading={commentsLoading}
            loadComments={loadComments}
            loadMore={loadMore}
            toggleLike={toggleLike}
          />
        </div>

        <div className="w-[340px] shrink-0">
          <TrackSidebar trackId={trackid} />
        </div>
      </div>
    </div>
  )
}