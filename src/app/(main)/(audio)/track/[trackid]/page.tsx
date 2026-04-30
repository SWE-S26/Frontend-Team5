"use client"

import { useEffect } from "react"
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

  const { getTrackById, track, loading, error } = useGetTrackById()
  const {
    comments, total, loading: commentsLoading,
    loadComments, loadMore, submitComment,
    toggleLike, postReply, deleteCommentById
  } = useStatelessComments()

  useEffect(() => {
    if (!trackid) return
    getTrackById(trackid)
    loadComments(trackid)
  }, [trackid]) // only trackid — no function refs in deps

  return (
    <div>
      <TrackHeader track={track} loading={loading} />

      <div className="flex w-full justify-between gap-8 mx-auto">
        <div className="flex-1">
          {loading && <div className="text-white">Loading...</div>}
          {error && <div className="text-red-500">{error}</div>}

          {!loading && !error && track && (
            <>
              <CommentInput
                trackId={trackid}
                submitComment={submitComment}
                loading={commentsLoading}
              />

              <div className="flex gap-4">
                {track.posterId && <Uploader posterId={track.posterId} />}

                <div className="flex flex-col gap-4">
                  {track.basicInfo?.description && (
                    <p className="text-white mt-4">{track.basicInfo.description}</p>
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

        <div className="w-[340px] shrink-0">
          <PopoverProvider>
            <TrackSidebar trackId={trackid} />
          </PopoverProvider>
        </div>
      </div>
    </div>
  )
}