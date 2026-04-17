"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SausageWaveform from "@/components/ui/SausageWaveform";
import Tooltip from "@/components/ui/Tooltip";
import MoreDropdown from "@/components/ui/MoreDropdown";

import { useState, useRef } from "react";
import { Avatar } from "antd";

import { motion, AnimatePresence } from "framer-motion";

import { useAppSelector } from "@/store/hooks";
import { useAudioProgress } from "@/hooks/useAudioProgress";

import { UserOutlined } from "@ant-design/icons";
import { IoIosMore, IoMdPlay, IoMdPause } from "react-icons/io";
import { HiHeart, HiOutlinePaperAirplane } from "react-icons/hi";
import { LuRepeat2, LuShare } from "react-icons/lu";
import { TbCopy } from "react-icons/tb";
import { ListStart } from "lucide-react";
import { RiPlayListAddLine } from "react-icons/ri";
import { BiStation } from "react-icons/bi";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  pause,
  play,
  setTrack,
  setTrackWithUrl,
} from "@/store/slices/playerSlice";

// https://OmarGamalS.publit.io/file/POWER.mp3

type CardProps = {
  img?: string;
  title?: string;
  artist?: string;
  trackId?: string;
  trackUrl?: string;
};

export default function WaveformCard({
  img,
  title,
  artist,
  trackId = "69e0ddf66edb30422ccc729f",
  trackUrl = "https://OmarGamalS.publit.io/file/POWER.mp3",
}: CardProps) {
  const [isLiked, setIsLiked] = useState(false);
  // const [isPlaying, setIsPlaying] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [canComment, setCanComment] = useState(false);

  const commentBoxRef = useRef<HTMLInputElement>(null);
  const commentButtonRef = useRef<HTMLButtonElement>(null);

  const profileImgLink = useAppSelector((state) => state.auth.profileImgLink);
  const { progress, seek } = useAudioProgress();

  const dispatch = useDispatch();

  const { currentTrackId, isPlaying } = useSelector(
    (state: RootState) => state.player,
  );

  const isThisCardPlaying = currentTrackId === trackId && isPlaying;

  const handleInputChange = () => {
    if (!commentBoxRef.current || !commentButtonRef.current) return;

    const comment = commentBoxRef.current.value.trim();
    setCanComment(comment.length > 0);
  };

  function handlePlayClick(e: React.MouseEvent) {
    e.stopPropagation();

    if (!trackId) return;

    if (isThisCardPlaying) {
      dispatch(pause());
      return;
    }

    if (trackUrl) {
      dispatch(setTrackWithUrl({ id: trackId, url: trackUrl }));
    } else {
      dispatch(setTrack(trackId));
    }

    setTimeout(() => {
      dispatch(play());
    }, 100);
  }

  function handleWaveformPlay(seekPercentage?: number) {
    // Start playback when interacting with waveform
    if (!trackId) return;

    // If already playing this track, don't restart it
    if (isThisCardPlaying) return;

    if (trackUrl) {
      dispatch(setTrackWithUrl({ id: trackId, url: trackUrl }));
    } else {
      dispatch(setTrack(trackId));
    }

    setTimeout(() => {
      // Seek to the clicked/dragged position if provided
      if (seekPercentage !== undefined) {
        seek(seekPercentage);
      }
      dispatch(play());
    }, 100);
  }

  return (
    <div className="flex items-stretch">
      {/* left side */}
      <div className="h-full overflow-hidden -m-1 -mb-1.75">
        <Card type="static" img={img} />
        <Card type="static" img={img} />
      </div>

      {/* right side */}
      <div className="flex flex-col flex-1 ml-6">
        {/* top */}
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
            <p className="text-sm font-bold text-silver ml-3">{artist}</p>
            <p className="text-sm font-bold text-white-smoke ml-3">{title}</p>
          </div>
        </div>

        {/* waveform */}
        <div
          className="w-full max-w-[632px] h-[60px] shrink-0 cursor-pointer"
          onClick={() => setShowComments(true)}
        >
          <SausageWaveform
            samplesUrl="/waveform.json"
            externalProgress={progress}
            onSeek={seek}
            onPlay={handleWaveformPlay}
            isPlaying={isThisCardPlaying}
          />
        </div>

        {/* comment box */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex items-center mt-4 mb-4"
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
                placeholder="Write a comment"
                className="ml-2 flex-1 bg-off-black rounded px-4 py-2 text-sm text-white-smoke caret-brilliant-orange outline outline-1 outline-transparent focus:outline-white-smoke/50 transition-[outline-color] duration-200 ease-in-out"
              />
              <Button
                ref={commentButtonRef}
                disabled={!canComment}
                className="ml-2 bg-off-black text-chinese-black font-bold py-2 px-4 rounded hover:bg-opacity-80"
              >
                <HiOutlinePaperAirplane className="text-[20px] text-white-smoke rotate-45" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* buttons */}
        <motion.div
          layout
          transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}
          className="flex items-center mt-auto"
        >
          <Tooltip label="Like">
            <Button
              onClick={() => setIsLiked(!isLiked)}
              className="bg-off-black mr-4"
              icon={<HiHeart className="text-[16px]" />}
            >
              177
            </Button>
          </Tooltip>

          <Tooltip label="Repost">
            <Button
              className="bg-off-black mr-4"
              icon={<LuRepeat2 className="text-[16px]" />}
            >
              177
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
        </motion.div>
      </div>
    </div>
  );
}
