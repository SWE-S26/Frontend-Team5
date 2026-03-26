"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SausageWaveform from "@/components/ui/SausageWaveform";
import { useState } from "react";

import { IoIosMore, IoMdPlay, IoMdPause } from "react-icons/io";
import { HiHeart } from "react-icons/hi";
import { LuRepeat2, LuShare } from "react-icons/lu";
import { TbCopy } from "react-icons/tb";
import Tooltip from "@/components/ui/Tooltip";

export default function WaveformCard() {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  function handleLikeClick(e: React.MouseEvent) {
    e.stopPropagation();
    setIsLiked((l) => !l);
    console.log("Like clicked!");
  }

  function handleMoreClick(e: React.MouseEvent) {
    e.stopPropagation();
    console.log("More options clicked!");
  }

  function handlePlayClick(e: React.MouseEvent) {
    e.stopPropagation();
    setIsPlaying((p) => !p);
    console.log("Play clicked!");
  }

  return (
    <div className="flex items-stretch">
      {/* left side */}
      <div className="h-full overflow-hidden -m-1 -mb-1.75">
        <Card type="static" />
      </div>

      {/* right side */}
      <div className="flex flex-col flex-1 ml-6 justify-between">
        {/* top */}
        <div className="flex items-center mb-4">
          <div
            className="w-10 h-10 bg-white-smoke rounded-full flex items-center justify-center cursor-pointer"
            onClick={handlePlayClick}
          >
            {!isPlaying ? (
              <IoMdPlay className="text-chinese-black text-[23px] ml-1" />
            ) : (
              <IoMdPause className="text-chinese-black text-[23px]" />
            )}
          </div>
          <div>
            <p className="text-xs font-bold text-silver ml-3">Artist Name</p>
            <p className="text-sm font-bold text-white-smoke ml-3">
              Track Title
            </p>
          </div>
        </div>

        {/* middle */}
        <div className="w-full max-w-[632px] h-[60px] flex-shrink-0">
          <SausageWaveform />
        </div>

        {/* bottom */}
        <div className="flex items-center">
          <Tooltip label="Like">
            <Button
              onClick={handleLikeClick}
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

          <Tooltip label="More">
            <Button
              onClick={handleMoreClick}
              className="bg-off-black mr-4"
              icon={<IoIosMore className="text-xl" />}
            />
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
