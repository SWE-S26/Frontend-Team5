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
    <div className="flex items-stretch w-full">
      {/* left side */}
      <div>
        <Card type="static" />
      </div>

      {/* right side */}
      <div className="flex flex-col flex-1 ml-4 justify-between my-1">
        {/* top */}
        <div className="flex items-center mb-2">
          <div
            className="w-10 h-10 bg-white-smoke rounded-full flex items-center justify-center cursor-pointer"
            onClick={handlePlayClick}
          >
            {!isPlaying ? (
              <IoMdPlay className="text-chinese-black text-[23px] ml-1.25" />
            ) : (
              <IoMdPause className="text-chinese-black text-[23px]" />
            )}
          </div>
        </div>

        {/* middle */}
        <div>
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
