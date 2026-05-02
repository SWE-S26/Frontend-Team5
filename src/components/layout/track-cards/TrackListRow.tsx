"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { IoMdPlay, IoMdPause } from "react-icons/io";
import { IoIosMore } from "react-icons/io";
import { HiHeart } from "react-icons/hi";
import { LuRepeat2, LuShare } from "react-icons/lu";
import { TbCopy } from "react-icons/tb";
import { ListStart } from "lucide-react";
import { RiPlayListAddLine } from "react-icons/ri";
import { BiStation } from "react-icons/bi";
import { BiSolidCommentDetail } from "react-icons/bi";

import MoreDropdown from "@/components/ui/MoreDropdown";
import ProfilePopover from "@/components/layout/track-cards/ProfilePopover";
import AddToPlaylistModal from "@/components/playlists/AddToPlaylistModal";
import SharePopup from "@/components/profile/SharePopUp";


import { RootState } from "@/store/store";
import {
  play,
  pause,
  playAudio,
  playNext,
  Track,
} from "@/store/slices/playerSlice";
import { useLikeTrackOptimistic } from "@/hooks/useLikes";
import { useRepostTrack } from "@/hooks/useReposts";
import { useGetProfile } from "@/hooks/useProfile";
import { getBaseUrl } from "@/utilities/getBaseUrl";
import { interactiveToastBus } from "@/lib/interactive-toasts/interactiveToastBus";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TrackListRowProps = {
  trackId: string;
  trackUrl: string;
  title: string;
  artist: string;
  artistId: string;
  permalink?: string;
  img?: string;
  duration?: number;
  playsCount: number;
  likeCount: number;
  repostCount: number;
  commentsCount: number;
  isLikedByUser?: boolean;
  isRepostedByUser?: boolean;
  allTracks?: Track[];
  artistFollowCount?: number;
  artistProfileImg?: string | undefined;
  artistLocation?: string;
  artistUserId?: string;
  artistIsFollowing?: boolean;
};

// ─── Helper ───────────────────────────────────────────────────────────────────

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TrackListRow({
  trackId,
  trackUrl,
  title,
  artist,
  artistId,
  permalink,
  img,
  duration,
  playsCount,
  likeCount,
  repostCount,
  commentsCount,
  isLikedByUser = false,
  isRepostedByUser = false,
  allTracks,
  artistFollowCount = 0,
  artistProfileImg = undefined ,
  artistLocation,
  artistUserId,
  artistIsFollowing = false,
}: TrackListRowProps) {
  const dispatch = useDispatch();
  const { currentTrackId, isPlaying } = useSelector(
    (state: RootState) => state.player,
  );
  const isThisPlaying = currentTrackId === trackId && isPlaying;

  const [isLiked, setIsLiked] = useState(isLikedByUser);
  const [isReposted, setIsReposted] = useState(isRepostedByUser);
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  useEffect(() => {
    if (!isMoreOpen) return;
    const handler = () => setIsMoreOpen(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [isMoreOpen]);

  const { getProfile, profile: artistProfile } = useGetProfile();

  useEffect(() => {
    if (artistId) getProfile(artistId);
  }, [artistId]);

  const profileLink = artistProfile?.profileLink ?? null;

  const { likeTrack } = useLikeTrackOptimistic(trackId);
  const { repostTrack } = useRepostTrack(trackId, true, repostCount);

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handlePlayClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (!trackId || !trackUrl) return;
    if (isThisPlaying) {
      dispatch(pause());
      return;
    }
    dispatch(
      playAudio({
        tracks: allTracks?.length
          ? allTracks
          : [{ id: trackId, url: trackUrl, title, artist, img, duration }],
        startId: trackId,
      }),
    );
    setTimeout(() => dispatch(play()), 0);
  }

  function handleLikeClick(e: React.MouseEvent) {
    e.stopPropagation();
    likeTrack();
    setIsLiked((prev) => !prev);
  }

  function handleRepostClick(e: React.MouseEvent) {
    e.stopPropagation();
    repostTrack();
    setIsReposted((prev) => !prev);
  }

  function handlePlayNextClick(e: React.MouseEvent) {
    e.stopPropagation();
    dispatch(
      playNext({
        tracks: { id: trackId, url: trackUrl, title, artist, img, duration },
      }),
    );
  }

  function handleCopyLink(e: React.MouseEvent) {
    e.stopPropagation();
    if (!profileLink || !permalink) return;
    navigator.clipboard.writeText(`${getBaseUrl()}/${profileLink}/${permalink}`);
    interactiveToastBus.emit({ type: "copied" });
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <div
        data-testid="track-list-row"
        className="group flex items-center gap-3 px-2 py-2 hover:bg-white/5 transition-colors"
      >
        {/* 1. Thumbnail — SQUARE, zero border-radius, play overlay on hover */}
        <div
          className="relative shrink-0 w-12 h-12 bg-off-black cursor-pointer"
          onClick={handlePlayClick}
        >
          {/* Image */}
          {img ? (
            <img
              src={img}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-off-black to-crusta/70" />
          )}

          {/* White circle play button — exactly like WaveformCard */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-8 h-8 bg-white-smoke rounded-full flex items-center justify-center hover:opacity-70 transition-opacity">
              {isThisPlaying ? (
                <IoMdPause className="text-chinese-black text-[16px]" />
              ) : (
                <IoMdPlay className="text-chinese-black text-[16px] ml-0.5" />
              )}
            </div>
          </div>
        </div>

        {/* 2. Text block — flex-1, three stacked lines: artist / title / stats */}
        <div className="flex-1 min-w-0 overflow-hidden">
          {/* Artist name — triggers ProfilePopover on hover */}
          <ProfilePopover
            id={`popover-${trackId}`}
            artistName={artist}
            followCount={artistFollowCount}
            profileImgLink={artistProfileImg}
            location={artistLocation}
            profileHref={`/profile/${artistId}`}
            followersHref={`/profile/${artistId}/followers`}
            userId={artistUserId}
            isFollowing={artistIsFollowing}
           
          >
            <p
              data-testid="track-list-row-artist"
              className="text-silver text-xs font-bold truncate hover:text-white-smoke transition-colors cursor-pointer w-fit"
            >
              {artist}
            </p>
          </ProfilePopover>

          {/* Title */}
          <a
            href={`/track/${trackId}`}
            onClick={(e) => e.stopPropagation()}
            data-testid="track-list-row-title"
            className="block text-white-smoke text-sm font-bold truncate hover:opacity-70 transition-opacity no-underline"
          >
            {title}
          </a>

          {/* Stats — plays / likes / reposts / comments */}
          <div className="flex items-center gap-3 mt-0.5">
            <span className="flex items-center gap-1 text-silver text-[11px]">
              <IoMdPlay className="text-[10px]" />
              {formatCount(playsCount)}
            </span>
            <span className="flex items-center gap-1 text-silver text-[11px]">
              <HiHeart className="text-[10px]" />
              {formatCount(likeCount)}
            </span>
            <span className="flex items-center gap-1 text-silver text-[11px]">
              <LuRepeat2 className="text-[10px]" />
              {formatCount(repostCount)}
            </span>
            <span className="flex items-center gap-1 text-silver text-[11px]">
              <BiSolidCommentDetail className="text-[10px]" />
              {formatCount(commentsCount)}
            </span>
          </div>
        </div>

        {/* 3. Hover actions — appear to the RIGHT of text block on hover */}
        <div className="shrink-0 flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          {/* Like */}
          <button
            data-testid="track-list-row-like"
            onClick={handleLikeClick}
            className=" hover:opacity-60 bg-off-black rounded-sm px-2 py-1 transition-opacity"
          >
            <HiHeart
              className={`text-[15px] transition-colors   ${
                isLiked ? "text-inferno" : "text-white-smoke"
              }`}
            />
          </button>

          {/* More dropdown */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              setIsMoreOpen((o) => !o);
            }}
          >
            <MoreDropdown
              trigger={
                <button
                  data-testid="track-list-row-more"
                  className="hover:opacity-60 bg-off-black rounded-sm px-2 py-1 transition-opacity"
                >
                  <IoIosMore
                    className={`text-[15px] transition-colors ${
                      isMoreOpen ? "text-inferno" : "text-white-smoke"
                    }`}
                  />
                </button>
              }
              tooltipLabel="More"
              items={[
                {
                  label: <span className={isReposted ? "text-inferno" : ""}>Repost</span>,
                  icon: (
                    <LuRepeat2
                      className={`text-lg ${isReposted ? "text-inferno" : ""}`}
                    />
                  ),
                  onClick: handleRepostClick,
                },
                {
                  label: "Share",
                  icon: <LuShare className="text-lg" />,
                  onClick: (e) => {
                    e.stopPropagation();
                    setIsShareOpen(true);
                  },
                },
                {
                  label: "Copy Link",
                  icon: <TbCopy className="text-lg" />,
                  onClick: handleCopyLink,
                },
                { type: "separator" },
                {
                  label: "Add to Next up",
                  icon: <ListStart size={19} className="scale-x-[-1]" />,
                  onClick: handlePlayNextClick,
                },
                {
                  label: "Add to Playlist",
                  icon: (
                    <RiPlayListAddLine className="text-lg scale-x-[-1] scale-y-[-1]" />
                  ),
                  onClick: (e) => {
                    e.stopPropagation();
                    setIsAddToPlaylistOpen(true);
                  },
                },
                {
                  label: "Station",
                  icon: <BiStation className="text-lg" />,
                  onClick: () => console.log("station"),
                },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddToPlaylistModal
        isOpen={isAddToPlaylistOpen}
        onClose={() => setIsAddToPlaylistOpen(false)}
        trackId={trackId}
        trackTitle={title}
        artistName={artist}
        trackImage={img}
      />
      <SharePopup isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </>
  );
}
