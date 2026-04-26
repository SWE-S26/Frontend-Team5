"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SausageWaveform from "@/components/ui/SausageWaveform";
import Tooltip from "@/components/ui/Tooltip";
import MoreDropdown from "@/components/ui/MoreDropdown";

import { useState, useRef, useEffect } from "react";
import { Avatar } from "antd";

import { motion, AnimatePresence, Transition } from "framer-motion";

import { useAppSelector } from "@/store/hooks";
import { useAudioProgress } from "@/hooks/useAudioProgress";
import { useIsVisible } from "@/hooks/useIsVisible";

import { useStatelessComments } from "@/hooks/useComments";
import { useLikeTrackOptimistic } from "@/hooks/useLikes";
import { useRepostTrack } from "@/hooks/useReposts";

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

import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { pause, play, playAudio, Track } from "@/store/slices/playerSlice";

type CardProps = {
  img?: string;
  title?: string;
  artist?: string;
  trackId: string;
  trackUrl?: string;
  duration?: number;
  likeCount: number;
  repostCount: number;
  isLikedByUser?: boolean;
  downloadUrl?: string;
  canEdit?: boolean;
  onEdit?: () => void;
  onAddToPlaylist?: () => void;
  allTracks?: Track[];
};

const FLASH_DURATION = 3000;

export default function WaveformCard({
  img,
  title,
  artist,
  trackId,
  trackUrl,
  duration,
  likeCount,
  repostCount,
  isLikedByUser,
  downloadUrl,
  canEdit = false,
  onEdit,
  onAddToPlaylist,
  allTracks,
}: CardProps) {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [canComment, setCanComment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentTimestamp, setCommentTimestamp] = useState(0);
  const [flashComment, setFlashComment] = useState<string | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [isLiked, setIsLiked] = useState(isLikedByUser ?? false);
  const [likeCountState, setLikeCountState] = useState(likeCount);

  const commentBoxRef = useRef<HTMLInputElement>(null);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const profileImgLink = useAppSelector((state) => state.auth.profileImgLink);

  const { ref, isVisible } = useIsVisible("200px");

  const { likeTrack } = useLikeTrackOptimistic(trackId);

  const {
    repostTrack,
    reposted,
    numOfReposts,
    loading: repostLoading,
  } = useRepostTrack(trackId, isVisible, repostCount);

  const { progress, currentTime, seekToPercentage } = useAudioProgress();

  const dispatch = useDispatch();
  const { currentTrackId, isPlaying } = useSelector(
    (state: RootState) => state.player,
  );
  const isThisCardPlaying = currentTrackId === trackId && isPlaying;

  useEffect(() => {
    if (isThisCardPlaying) setShowCommentBox(true);
  }, [isThisCardPlaying]);

  const { submitComment } = useStatelessComments();

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
    }
  }

  function handlePlayClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (!trackId || !trackUrl) return;
    if (isThisCardPlaying) {
      dispatch(pause());
      return;
    }
    dispatch(
      playAudio({
        tracks: allTracks?.length
          ? allTracks
          : [{ id: trackId, url: trackUrl ?? "", title, artist, img }],
        startId: trackId,
      }),
    );
    setTimeout(() => dispatch(play()), 0);
  }

  function handleWaveformPlay(seekPercentage?: number) {
    if (!trackId || !trackUrl || isThisCardPlaying) return;
    dispatch(
      playAudio({
        tracks: allTracks?.length
          ? allTracks
          : [{ id: trackId, url: trackUrl ?? "", title, artist, img }],
        startId: trackId,
      }),
    );
    setTimeout(() => {
      if (seekPercentage !== undefined) seekToPercentage(seekPercentage);
      dispatch(play());
    }, 100);
  }

  const transitionConfig: Transition = { duration: 0.25, ease: "easeOut" };

  const handleDownload = () => {
    if (!downloadUrl) return;
    window.open(downloadUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div ref={ref} className="flex items-stretch">
      <div className="h-full overflow-hidden -m-1 -mb-1.75">
        <Card type="static" img={img} />
      </div>

      <div className="flex flex-col flex-1 ml-6">
        <div className="flex items-center mb-4">
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
            <p className="text-sm font-bold text-silver ml-3">{artist}</p>
            <p className="text-sm font-bold text-white-smoke ml-3">{title}</p>
          </div>
        </div>

        <div
          className="w-full max-w-158 h-15 shrink-0 cursor-pointer"
          onClick={handleOpenCommentBox}
        >
          <SausageWaveform
            trackId={trackId}
            samplesUrl="/waveform.json"
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

          <div className="flex items-center">
            <Tooltip label="Like">
              <Button
                onClick={handleLikeClick}
                className="bg-off-black mr-4"
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
                onClick={() => repostTrack()}
                className="bg-off-black mr-4"
                icon={
                  <LuRepeat2
                    className={`text-[16px] transition-colors ${reposted ? "text-inferno" : ""}`}
                  />
                }
              >
                <span
                  className={`ml-0.5 inline-block min-w-[1ch] text-left transition-opacity ${reposted ? "text-inferno" : ""} ${
                    repostLoading ? "opacity-50" : "opacity-100"
                  }`}
                >
                  {numOfReposts}
                </span>
              </Button>
            </Tooltip>
            <Tooltip label="Share">
              <Button
                className="bg-off-black mr-4"
                icon={<LuShare className="text-xl" />}
              />
            </Tooltip>
            <Tooltip label="Copy Link">
              <Button
                className="bg-off-black mr-4"
                icon={<TbCopy className="text-xl" />}
              />
            </Tooltip>
            {onAddToPlaylist && canEdit && (
              <Tooltip label="Add to playlist">
                <Button
                  onClick={onAddToPlaylist}
                  className="bg-off-black mr-4"
                  icon={<FiPlusSquare className="text-xl" />}
                />
              </Tooltip>
            )}
            {onEdit && canEdit && (
              <Tooltip label="Edit track">
                <Button
                  onClick={onEdit}
                  className="bg-off-black mr-4"
                  icon={<PiPencilSimple className="text-xl" />}
                />
              </Tooltip>
            )}
            {downloadUrl && (
              <Tooltip label="Download">
                <Button
                  onClick={handleDownload}
                  className="bg-off-black mr-4"
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
                },
                {
                  label: "Add to Playlist",
                  icon: (
                    <RiPlayListAddLine className="text-lg scale-x-[-1] scale-y-[-1]" />
                  ),
                },
                { label: "Station", icon: <BiStation className="text-lg" /> },
              ]}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
