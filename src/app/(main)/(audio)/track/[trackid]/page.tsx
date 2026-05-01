"use client"

import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"

import TrackHeader from "@/components/track/TrackHeader"
import TrackSidebar from "@/components/track/TrackSidebar"
import CommentInput from "@/components/track/CommentInput"
import CommentList from "@/components/track/CommentListProps"
import Uploader from "@/components/track/Uploader"

import { useGetTrackById } from "@/hooks/useTracks"
import { useStatelessComments } from "@/hooks/useComments"
import { PopoverProvider } from "@/components/layout/track-cards/PopoverContext"

export default function Track() {
  const { trackid } = useParams<{ trackid: string }>()
  const [currentTime, setCurrentTime] = useState(0)
  const { getTrackById, track, loading, error } = useGetTrackById()
  const {
    comments, total, loading: commentsLoading,
    loadComments, loadMore, submitComment,
    toggleLike, postReply, deleteCommentById
  } = useStatelessComments()

  const repeatFnRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (!trackid) return
    getTrackById(trackid)
    loadComments(trackid)
  }, [trackid])

  return (
    <div className="min-h-screen">
      {/* Track Header — full width */}
      <TrackHeader
        track={track}
        loading={loading}
        onTimeUpdate={setCurrentTime}
        onRepeat={(fn) => { repeatFnRef.current = fn }}
      />

      {/* Main content area */}
      <div className="flex flex-col xl:flex-row w-full gap-6 xl:gap-10 px-4 sm:px-6 lg:px-10 py-6 mx-auto max-w-screen-2xl">
        
        {/* Left — comments + uploader */}
        <div className="flex-1 min-w-0">
          {loading && <div className="text-white">Loading...</div>}
          {error && <div className="text-red-500">{error}</div>}

          {!loading && !error && track && (
            <>
              <CommentInput
                trackId={trackid}
                submitComment={submitComment}
                loading={commentsLoading}
                currentTime={currentTime}
              />

              {/* Uploader + description stack on mobile, row on md+ */}
              <div className="flex flex-col md:flex-row  mt-4 w-full">
                {track.posterId && (
                  <div className="w-full md:w-auto shrink-0">
                    <Uploader posterId={track.posterId} />
                  </div>
                )}

                <div className="flex flex-col gap-4 flex-1 min-w-0">
                  {track.basicInfo?.description && (
                    <p className="text-white">{track.basicInfo.description}</p>
                  )}

                  <CommentList
                    trackId={trackid}
                    comments={comments}
                    total={total}
                    loading={commentsLoading}
                    loadComments={loadComments}
                    loadMore={loadMore}
                    toggleLike={toggleLike}
                    submitComment={submitComment}
                    postReply={postReply}
                    deleteCommentById={deleteCommentById}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right — sidebar, moves below on mobile */}
        <div className="w-full xl:w-[340px] xl:shrink-0">
          <PopoverProvider>
            <TrackSidebar
              trackId={trackid}
              track={track}
              onRepeatPlay={() => repeatFnRef.current?.()}
            />
          </PopoverProvider>
        </div>
      </div>
    </div>
  )
}