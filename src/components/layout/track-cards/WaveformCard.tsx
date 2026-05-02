"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/TrackCard";
import SausageWaveform from "@/components/ui/SausageWaveform";
import Tooltip from "@/components/ui/Tooltip";
import MoreDropdown from "@/components/ui/MoreDropdown";
import AddToPlaylistModal from "@/components/playlists/AddToPlaylistModal";
import PreviewTooltip from "@/components/layout/track-cards/PreviewTooltip";

import { useState, useRef, useEffect } from "react";
import { Avatar } from "antd";

import { motion, AnimatePresence, Transition } from "framer-motion";

import { useAppSelector } from "@/store/hooks";
import { useAudioProgress } from "@/hooks/useAudioProgress";
import { useIsVisible } from "@/hooks/useIsVisible";

import { useStatelessComments } from "@/hooks/useComments";
import { useLikeTrackOptimistic } from "@/hooks/useLikes";
import { useRepostTrack } from "@/hooks/useReposts";
import { tracksService } from "@/services/tracks.service";

import { UserOutlined } from "@ant-design/icons";
import { IoIosMore, IoMdPlay, IoMdPause } from "react-icons/io";
import { HiHeart, HiOutlinePaperAirplane } from "react-icons/hi";
import { LuRepeat2, LuShare } from "react-icons/lu";
import { TbCopy } from "react-icons/tb";
import { MdOutlineDownloadForOffline } from "react-icons/md";
import { FiPlusSquare } from "react-icons/fi";
import { ListStart } from "lucide-react";
import { RiPlayListAddLine } from "react-icons/ri";
import { BiStation } from "react-icons/bi";
import { PiPencilSimple } from "react-icons/pi";
import { BiSolidCommentDetail } from "react-icons/bi";

import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  pause,
  play,
  playAudio,
  playNext,
  Track,
} from "@/store/slices/playerSlice";
import { getBaseUrl } from "@/utilities/getBaseUrl";
import { interactionToast } from "@/lib/interactive-toasts/interactiveToast";
import { interactiveToastBus } from "@/lib/interactive-toasts/interactiveToastBus";
import ProfilePopover from "./ProfilePopover";
import { useGetProfile } from "@/hooks/useProfile";

type CardProps = {
  img?: string;
  title?: string;
  artist?: string;
  artistId?: string;
  trackId: string;
  trackUrl?: string;
  duration?: number;
  tag?: string;
  audioClipStart?: number;
  audioClipEnd?: number;
  likeCount: number;
  repostCount: number;
  commentsCount: number;
  playsCount: number;
  isLikedByUser?: boolean;
  isRepostedByUser?: boolean;
  enableDirectDownload?: boolean;
  downloadUrl?: string;
  canEdit?: boolean;
  wfLink?: string;
  onEdit?: () => void;
  onAddToPlaylist?: () => void;
  allTracks?: Track[];
  isRepost?: boolean;
  reposterId?: string;
  reposterName?: string;
};

const FLASH_DURATION = 3000;
const HOVER_PREVIEW_DELAY = 600;
const clipBoundsCache = new Map<string, { start: number; end: number }>();

export default function WaveformCard({
  img,
  title,
  artist,
  artistId,
  trackId,
  trackUrl,
  duration,
  tag,
  audioClipStart,
  audioClipEnd,
  likeCount,
  repostCount,
  commentsCount,
  playsCount,
  isLikedByUser,
  isRepostedByUser,
  enableDirectDownload = false,
  downloadUrl,
  canEdit = false,
  wfLink,
  onEdit,
  onAddToPlaylist,
  allTracks,
  isRepost = false,
  reposterId,
  reposterName,
}: CardProps) {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [canComment, setCanComment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentTimestamp, setCommentTimestamp] = useState(0);
  const [flashComment, setFlashComment] = useState<string | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [isLiked, setIsLiked] = useState(isLikedByUser ?? false);
  const [isReposted, setIsReposted] = useState(isRepostedByUser ?? false);
  const [likeCountState, setLikeCountState] = useState(likeCount);
  const [repostCountState, setRepostCountState] = useState(repostCount);
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false);

  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const { getProfile, profile: artistProfile } = useGetProfile();
  const { getProfile: getReposterProfile, profile: reposterProfile } =
    useGetProfile();

  useEffect(() => {
    if (artistId) getProfile(artistId);
  }, [artistId]);

  useEffect(() => {
    if (isRepost && reposterId) getReposterProfile(reposterId);
  }, [isRepost, reposterId]);

  useEffect(() => {
    if (!isMoreOpen) return;
    const handler = () => setIsMoreOpen(false);
    setTimeout(() => {
      document.addEventListener("click", handler);
    }, 0);
    return () => document.removeEventListener("click", handler);
  }, [isMoreOpen]);

  const commentBoxRef = useRef<HTMLInputElement>(null);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previewStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const previewingRef = useRef(false);
  const previewStartingRef = useRef(false);
  const previewRequestIdRef = useRef(0);
  const isHoveringRef = useRef(false);
  const previewTimeUpdateHandlerRef = useRef<
    ((this: HTMLAudioElement, ev: Event) => any) | null
  >(null);
  const fetchClipPromiseRef = useRef<Promise<{
    start: number;
    end: number;
  } | null> | null>(null);

  const profileImgLink = useAppSelector((state) => state.auth.profileImgLink);
  const authRole = useAppSelector((state) => state.auth.role);
  const isAuthenticated = useAppSelector(
    (state) => state.auth.isAuthenticated && state.auth.hasHydrated,
  );
  const isArtistPro = authRole === "Pro";
  const allowDownload = isArtistPro || !!enableDirectDownload;

  const { ref, isVisible } = useIsVisible("200px");

  const { likeTrack } = useLikeTrackOptimistic(trackId);

  const {
    repostTrack,
    reposted,
    numOfReposts,
    loading: repostLoading,
  } = useRepostTrack(trackId, isVisible, repostCount);

  const {
    progress,
    currentTime,
    seekToPercentage,
    dragStart,
    dragMove,
    dragEnd,
  } = useAudioProgress();

  const dispatch = useDispatch();
  const { currentTrackId, isPlaying } = useSelector(
    (state: RootState) => state.player,
  );
  const isThisCardPlaying = currentTrackId === trackId && isPlaying;

  const [showPreviewTooltip, setShowPreviewTooltip] = useState(false);
  const [previewTooltipPos, setPreviewTooltipPos] = useState({ x: 0, y: 0 });
  const [isFetchingClip, setIsFetchingClip] = useState(false);
  const [fetchedClip, setFetchedClip] = useState<{
    start: number;
    end: number;
  } | null>(null);

  useEffect(() => {
    if (isThisCardPlaying) setShowCommentBox(true);
  }, [isThisCardPlaying]);

  useEffect(() => {
    const cached = clipBoundsCache.get(trackId);
    setFetchedClip(cached ?? null);
  }, [trackId]);

  useEffect(() => {
    if (isPlaying) stopPreview();
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      if (previewStopTimerRef.current)
        clearTimeout(previewStopTimerRef.current);
      if (previewAudioRef.current) {
        if (previewTimeUpdateHandlerRef.current) {
          previewAudioRef.current.removeEventListener(
            "timeupdate",
            previewTimeUpdateHandlerRef.current,
          );
        }
        previewAudioRef.current.pause();
      }
    };
  }, []);

  const { submitComment } = useStatelessComments();

  const parseClipBounds = (startRaw: unknown, endRaw: unknown) => {
    const start = Number(startRaw);
    const end = Number(endRaw);
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start)
      return null;
    return { start, end };
  };

  const isDisabledClip = (startRaw: unknown, endRaw: unknown) => {
    return Number(startRaw) === 0 && Number(endRaw) === 0;
  };

  const getClipBounds = (
    serverClip?: { start: number; end: number } | null,
  ) => {
    if (serverClip) {
      if (isDisabledClip(serverClip.start, serverClip.end)) return null;
      return serverClip;
    }
    if (isDisabledClip(audioClipStart, audioClipEnd)) return null;
    const propClip = parseClipBounds(audioClipStart, audioClipEnd);
    if (propClip) return propClip;
    const start = 0;
    const end = duration ? Math.min(duration, 20) : 20;
    if (end <= start) return null;
    return { start, end };
  };

  const ensureTrackClip = async () => {
    const cached = clipBoundsCache.get(trackId);
    if (cached) return cached;
    if (fetchClipPromiseRef.current) return fetchClipPromiseRef.current;

    setIsFetchingClip(true);
    const request = isAuthenticated
      ? tracksService.getTrackById(trackId)
      : tracksService.getPublicTrackById(trackId);

    const promise = request
      .then((res) => {
        const rawStart = res.data.data.audioClip?.start;
        const rawEnd = res.data.data.audioClip?.end;
        if (isDisabledClip(rawStart, rawEnd)) {
          const disabledClip = { start: 0, end: 0 };
          clipBoundsCache.set(trackId, disabledClip);
          setFetchedClip(disabledClip);
          return disabledClip;
        }

        const clip = parseClipBounds(rawStart, rawEnd);
        if (clip) {
          clipBoundsCache.set(trackId, clip);
          setFetchedClip(clip);
        }
        return clip;
      })
      .catch(() => null)
      .finally(() => {
        fetchClipPromiseRef.current = null;
        setIsFetchingClip(false);
      });

    fetchClipPromiseRef.current = promise;
    return promise;
  };

  const handleInputChange = () => {
    if (!commentBoxRef.current) return;
    setCanComment(commentBoxRef.current.value.trim().length > 0);
  };

  const handleInputFocus = () => {
    setCommentTimestamp(currentTime);
    setInputFocused(true);
  };

  const handleInputBlur = () => {
    setInputFocused(false);
  };

  const handleOpenCommentBox = () => {
    setShowCommentBox(true);
  };

  const handleSubmitComment = async () => {
    if (!trackId || !commentBoxRef.current) return;
    const content = commentBoxRef.current.value.trim();
    if (!content) return;

    setIsSubmitting(true);
    try {
      await submitComment(trackId, {
        content,
        timestamp: Math.floor(commentTimestamp),
      });

      commentBoxRef.current.value = "";
      setCanComment(false);
      commentBoxRef.current.blur();

      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
      setFlashComment(content);
      setTimeout(() => setReloadTrigger((n) => n + 1), FLASH_DURATION - 1500);
      flashTimerRef.current = setTimeout(
        () => setFlashComment(null),
        FLASH_DURATION,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && canComment && !isSubmitting) handleSubmitComment();
    if (e.key === "Escape") {
      setShowCommentBox(false);
      setInputFocused(false);
    }
  };

  function handleLikeClick() {
    likeTrack();

    setIsLiked((l) => !l);
    if (isLiked) {
      setLikeCountState((c) => c - 1);
    } else {
      setLikeCountState((c) => c + 1);
      interactionToast.liked(title ?? "the track", img ?? "");
    }
  }

  function handleRepostClick() {
    repostTrack();
    setIsReposted((r) => !r);
    if (isReposted) {
      setRepostCountState((c) => c - 1);
    } else {
      setRepostCountState((c) => c + 1);
      interactionToast.reposted(title ?? "the track", img ?? "");
    }
  }

  const handleCopyLink = () => {
    if (!trackId) return;

    const url = `${getBaseUrl()}/track/${trackId}`;

    navigator.clipboard.writeText(url);
    interactiveToastBus.emit({
      type: "copied",
    });
  };

  const allTracksRef = useRef(allTracks);
  allTracksRef.current = allTracks ?? [];

  function handlePlayClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (!trackId || !trackUrl) return;
    stopPreview();
    if (isThisCardPlaying) {
      dispatch(pause());
      return;
    }
    dispatch(
      playAudio({
        tracks: allTracksRef.current?.length
          ? allTracksRef.current
          : [{ id: trackId, url: trackUrl ?? "", title, artist, img }],
        startId: trackId,
      }),
    );
    setTimeout(() => dispatch(play()), 0);
  }

  function handleWaveformPlay(seekPercentage?: number) {
    if (!trackId || !trackUrl || isThisCardPlaying) return;
    stopPreview();
    dispatch(
      playAudio({
        tracks: allTracksRef.current?.length
          ? allTracksRef.current
          : [{ id: trackId, url: trackUrl ?? "", title, artist, img }],
        startId: trackId,
      }),
    );
    setTimeout(() => {
      if (seekPercentage !== undefined) seekToPercentage(seekPercentage);
      dispatch(play());
    }, 100);
  }

  function handlePlayNextClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (!trackId || !trackUrl) return;

    interactionToast.queued(title ?? "the track", img ?? "");

    dispatch(
      playNext({
        tracks: {
          id: trackId,
          url: trackUrl,
          title,
          artist,
          img,
        },
      }),
    );
  }

  const transitionConfig: Transition = { duration: 0.25, ease: "easeOut" };

  const handleDownload = () => {
    if (!allowDownload || !downloadUrl) return;
    window.open(downloadUrl, "_blank", "noopener,noreferrer");
  };

  const handleOpenAddToPlaylistModal = () => {
    setIsAddToPlaylistOpen(true);
  };

  function stopPreview() {
    previewStartingRef.current = false;
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    if (previewStopTimerRef.current) {
      clearTimeout(previewStopTimerRef.current);
      previewStopTimerRef.current = null;
    }
    if (previewAudioRef.current) {
      if (previewTimeUpdateHandlerRef.current) {
        previewAudioRef.current.removeEventListener(
          "timeupdate",
          previewTimeUpdateHandlerRef.current,
        );
        previewTimeUpdateHandlerRef.current = null;
      }
      previewAudioRef.current.pause();
    }
    previewingRef.current = false;
    setShowPreviewTooltip(false);
  }

  async function startPreview(requestId: number) {
    if (!trackUrl || isPlaying) return;
    if (previewingRef.current || previewStartingRef.current) return;

    previewStartingRef.current = true;

    const serverClip = await ensureTrackClip();
    if (requestId !== previewRequestIdRef.current || !isHoveringRef.current) {
      previewStartingRef.current = false;
      return;
    }

    const clip = getClipBounds(serverClip);
    if (!clip) {
      previewStartingRef.current = false;
      return;
    }

    const clipStart = clip.start;
    const clipEnd = clip.end;
    if (clipEnd <= clipStart) {
      previewStartingRef.current = false;
      return;
    }

    let audio = previewAudioRef.current;
    if (!audio || audio.src !== trackUrl) {
      audio = new Audio(trackUrl);
      audio.preload = "metadata";
      previewAudioRef.current = audio;
    }

    const playFrom = () => {
      if (
        !audio ||
        requestId !== previewRequestIdRef.current ||
        !isHoveringRef.current
      ) {
        previewStartingRef.current = false;
        return;
      }

      try {
        audio.currentTime = Math.max(0, clipStart);
      } catch {}

      audio.play().catch(() => {
        previewStartingRef.current = false;
        setShowPreviewTooltip(false);
      });

      previewStartingRef.current = false;
      previewingRef.current = true;
      setShowPreviewTooltip(true);

      if (previewTimeUpdateHandlerRef.current) {
        audio.removeEventListener(
          "timeupdate",
          previewTimeUpdateHandlerRef.current,
        );
      }
      const onTimeUpdate = () => {
        if (audio.currentTime >= clipEnd) {
          stopPreview();
        }
      };
      previewTimeUpdateHandlerRef.current = onTimeUpdate;
      audio.addEventListener("timeupdate", onTimeUpdate);

      const playMs = Math.max(0, clipEnd - clipStart) * 1000;
      if (previewStopTimerRef.current)
        clearTimeout(previewStopTimerRef.current);
      previewStopTimerRef.current = setTimeout(stopPreview, playMs + 200);
    };

    if (audio.readyState >= 1) {
      playFrom();
    } else {
      audio.addEventListener("loadedmetadata", playFrom, { once: true });
      audio.load();
    }
  }

  function handleHoverStart(e: React.MouseEvent) {
    if (isThisCardPlaying || isPlaying) return;
    isHoveringRef.current = true;
    const requestId = ++previewRequestIdRef.current;
    setPreviewTooltipPos({ x: e.clientX, y: e.clientY });
    void ensureTrackClip();
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      void startPreview(requestId);
    }, HOVER_PREVIEW_DELAY);
  }

  function handleHoverMove(e: React.MouseEvent) {
    setPreviewTooltipPos({ x: e.clientX, y: e.clientY });
  }

  function handleHoverEnd() {
    isHoveringRef.current = false;
    previewRequestIdRef.current += 1;
    stopPreview();
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-0 px-4 sm:px-0">
        <div
          className="hidden sm:block h-full overflow-hidden -m-1 -mb-1.75 sm:shrink-0"
          ref={ref}
          onMouseEnter={handleHoverStart}
          onMouseMove={handleHoverMove}
          onMouseLeave={handleHoverEnd}
        >
          <Card appearance="static" img={img} />
        </div>

        <div className="flex flex-col flex-1 sm:ml-6">
          <div className="flex items-center mb-4 relative">
            <div
              className="w-10 h-10 bg-white-smoke rounded-full flex items-center justify-center cursor-pointer"
              onClick={handlePlayClick}
            >
              {!isThisCardPlaying ? (
                <IoMdPlay className="text-chinese-black text-[23px] ml-1" />
              ) : (
                <IoMdPause className="text-chinese-black text-[23px]" />
              )}
            </div>
            <div>
              {isRepost && reposterId ? (
                <div className="flex items-center gap-1 text-sm font-bold text-silver ml-3">
                  <a
                    href={`/profile/${artistId}`}
                    className="text-silver hover:text-white-smoke no-underline transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {artist}
                  </a>
                  <LuRepeat2 className="text-[13px] shrink-0" />

                  <a
                    href={`/profile/${reposterId}`}
                    className="text-silver hover:text-white-smoke no-underline transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {reposterName}
                  </a>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-sm font-bold text-silver ml-3">
                  <a
                    href={`/profile/${artistId}`}
                    className="text-silver hover:text-white-smoke no-underline transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {artist}
                  </a>
                </div>
              )}
              <a
                href={`/track/${trackId}`}
                className="text-sm font-bold text-white-smoke ml-3 no-underline hover:text-silver transition-colors truncate"
                onClick={(e) => e.stopPropagation()}
              >
                {title}
              </a>{" "}
            </div>

            {tag && (
              <a className="absolute top-0 right-0 cursor-pointer no-underline group">
                <span className="text-[13px] text-white-smoke bg-off-black px-2 py-1 rounded-full group-hover:text-white-smoke/50 transition-colors">
                  # {tag}
                </span>
              </a>
            )}
          </div>

          <div
            className="w-full h-20 sm:h-15 shrink-0 cursor-pointer"
            onClick={handleOpenCommentBox}
          >
            <SausageWaveform
              trackId={trackId}
              samplesUrl={wfLink ?? "/waveform.json"}
              externalProgress={progress}
              onSeek={seekToPercentage}
              onPlay={handleWaveformPlay}
              onAvatarHover={handleOpenCommentBox}
              onTimestampChange={setCommentTimestamp}
              isPlaying={isThisCardPlaying}
              currentTime={currentTime}
              duration={duration}
              isCommenting={inputFocused}
              commentTimestamp={commentTimestamp}
              profileAvatarUrl={profileImgLink ?? undefined}
              flashComment={flashComment}
              reloadTrigger={reloadTrigger}
              enabled={isVisible}
            />
          </div>

          <motion.div
            layout
            transition={{ layout: transitionConfig }}
            className="flex flex-col mt-auto"
          >
            <AnimatePresence>
              {showCommentBox && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={transitionConfig}
                  className="flex items-center overflow-hidden mt-7"
                >
                  <Avatar
                    size="large"
                    icon={
                      profileImgLink ? (
                        <img src={profileImgLink} alt="Profile" />
                      ) : (
                        <UserOutlined />
                      )
                    }
                  />
                  <input
                    type="text"
                    ref={commentBoxRef}
                    onInput={handleInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    onKeyDown={handleKeyDown}
                    placeholder="Write a comment"
                    className="ml-2 flex-1 bg-off-black rounded px-4 py-2 text-sm text-white-smoke caret-brilliant-orange outline outline-transparent focus:outline-white-smoke/50 transition-[outline-color] duration-200 ease-in-out"
                  />
                  <Button
                    disabled={!canComment || isSubmitting}
                    onClick={handleSubmitComment}
                    className="ml-2 bg-off-black text-chinese-black font-bold py-2 px-4 rounded hover:bg-opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <HiOutlinePaperAirplane
                      className={`text-[20px] text-white-smoke rotate-45 transition-opacity ${isSubmitting ? "opacity-40" : "opacity-100"}`}
                    />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-4">
              <Tooltip label="Like">
                <Button
                  onClick={handleLikeClick}
                  className="bg-off-black"
                  icon={
                    <HiHeart
                      className={`text-[16px] transition-colors ${isLiked ? "text-inferno" : ""}`}
                    />
                  }
                >
                  <span
                    className={`ml-0.5 inline-block min-w-[1ch] text-left transition-colors ${isLiked ? "text-inferno" : ""}`}
                  >
                    {likeCountState}
                  </span>
                </Button>
              </Tooltip>
              <Tooltip label="Repost">
                <Button
                  onClick={handleRepostClick}
                  className="bg-off-black"
                  icon={
                    <LuRepeat2
                      className={`text-[16px] transition-colors ${isReposted ? "text-inferno" : ""}`}
                    />
                  }
                >
                  <span
                    className={`ml-0.5 inline-block min-w-[1ch] text-left transition-opacity ${isReposted ? "text-inferno" : ""} ${
                      repostLoading ? "opacity-50" : "opacity-100"
                    }`}
                  >
                    {repostCountState}
                  </span>
                </Button>
              </Tooltip>
              <Tooltip label="Share">
                <Button
                  className="bg-off-black"
                  icon={<LuShare className="text-xl" />}
                />
              </Tooltip>
              <Tooltip label="Copy Link">
                <Button
                  className="bg-off-black"
                  icon={<TbCopy className="text-xl" />}
                  onClick={handleCopyLink}
                />
              </Tooltip>
              {onEdit && canEdit && (
                <Tooltip label="Edit track">
                  <Button
                    onClick={onEdit}
                    className="bg-off-black"
                    icon={<PiPencilSimple className="text-xl" />}
                  />
                </Tooltip>
              )}
              {allowDownload && downloadUrl && (
                <Tooltip label="Download">
                  <Button
                    onClick={handleDownload}
                    className="bg-off-black"
                    icon={<MdOutlineDownloadForOffline className="text-xl" />}
                  />
                </Tooltip>
              )}
              <MoreDropdown
                trigger={
                  <Button
                    className="bg-off-black"
                    icon={<IoIosMore className="text-xl" />}
                  />
                }
                tooltipLabel="More"
                items={[
                  {
                    label: "Add to Next up",
                    icon: <ListStart size={19} className="scale-x-[-1]" />,
                    onClick: (e) => handlePlayNextClick(e),
                  },
                  {
                    label: "Add to Playlist",
                    icon: (
                      <RiPlayListAddLine className="text-lg scale-x-[-1] scale-y-[-1]" />
                    ),
                    onClick: handleOpenAddToPlaylistModal,
                  },
                  {
                    label: "Station",
                    disabled: true,
                    icon: <BiStation className="text-lg" />,
                  },
                ]}
              />

              <div className="ml-0 sm:ml-auto flex items-center gap-4">
                <div className="flex items-center gap-1 text-silver">
                  <IoMdPlay className="text-silver text-[12px]" />
                  <span className="text-[12px]">{playsCount}</span>
                </div>

                <a className="flex items-center gap-1 cursor-pointer hover:opacity-50 transition-opacity no-underline text-silver">
                  <BiSolidCommentDetail className="text-silver" />
                  <span className="text-[12px]">{commentsCount}</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      {showPreviewTooltip && (
        <PreviewTooltip
          x={previewTooltipPos.x}
          y={previewTooltipPos.y}
          img={img}
          title={title}
          artist={artist}
          isPreviewActive={showPreviewTooltip}
        />
      )}
      <AddToPlaylistModal
        isOpen={isAddToPlaylistOpen}
        onClose={() => setIsAddToPlaylistOpen(false)}
        trackId={trackId}
        trackTitle={title}
        artistName={artist}
        trackImage={img}
      />
    </>
  );
}
