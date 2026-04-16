"use client";
import { useState } from "react";

import { IoIosMore, IoMdPlay, IoMdPause } from "react-icons/io";
import { RiPlayListAddLine } from "react-icons/ri";
import { HiHeart } from "react-icons/hi";
import { ListStart } from "lucide-react";

import MoreDropdown from "./MoreDropdown";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import {
  setTrack,
  setTrackWithUrl,
  play,
  pause,
} from "@/store/slices/playerSlice";

import { useLikeTrack } from "@/hooks/useLikes";

type CardProps = {
  img?: string;
  title?: string;
  artist?: string;
  trackId?: string;
  trackUrl?: string;
  type?: "interactive" | "static";
};

export default function Card({
  img,
  title,
  artist,
  trackId,
  trackUrl,
  type = "interactive",
}: CardProps) {
  const { likeTrack, liked, loading } = useLikeTrack();
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const dispatch = useDispatch();

  const { currentTrackId, isPlaying } = useSelector(
    (state: RootState) => state.player,
  );

  const isThisCardPlaying = currentTrackId === trackId && isPlaying;

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
    }, 0);
  }

  function handleLikeClick(e: React.MouseEvent) {
    e.stopPropagation();
    setIsLiked((l) => !l);
  }

  return (
    <>
      {type === "interactive" ? (
        <div className="flex flex-col max-w-40">
          <div className="relative w-40 aspect-square rounded group cursor-pointer bg-off-black m-1 mb-1.75">
            <div className="absolute inset-0 rounded overflow-hidden">
              <div
                className={`absolute inset-0 rounded overflow-hidden ${
                  !img ? "bg-gradient-to-br from-off-black to-crusta/70" : ""
                }`}
              ></div>

              {img && (
                <button
                  key={img}
                  className="absolute inset-0 bg-cover bg-center overflow-hidden rounded opacity-0 animate-fade-in"
                  style={{ backgroundImage: `url(${img})` }}
                />
              )}

              {img && (
                <div className="absolute inset-0 transition-all duration-200 bg-white/50 opacity-0 group-hover:opacity-100" />
              )}
            </div>

            {/* Play Button */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white-smoke rounded-full z-10 opacity-0 group/play group-hover:opacity-100 flex items-center justify-center transition-all duration-200">
              {!isThisCardPlaying ? (
                <IoMdPlay
                  className="text-chinese-black text-[38px] ml-1.5 group-hover/play:opacity-50"
                  onClick={handlePlayClick}
                />
              ) : (
                <IoMdPause
                  className="text-chinese-black text-[38px] group-hover/play:opacity-50"
                  onClick={handlePlayClick}
                />
              )}
            </div>

            {/* Like Button */}
            <div className="absolute bottom-3.25 right-[48.5px] z-30 group/tooltip flex flex-col items-center w-10 ">
              <HiHeart
                className={
                  "text-[16px] font-bold opacity-0 group-hover:opacity-100 group-hover/tooltip:opacity-50 transition-all duration-200" +
                  (isLiked ? " text-brilliant-orange" : " text-chinese-black")
                }
                onClick={handleLikeClick}
              />

              <div className="absolute top-full mt-2 px-2 py-1 bg-off-black text-white-smoke text-[11px] rounded opacity-0 group-hover/tooltip:opacity-100 pointer-events-none whitespace-nowrap z-50">
                Like
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-off-black" />
              </div>
            </div>

            <div className="absolute bottom-1.25 right-2.25 z-30">
              <MoreDropdown
                trigger={
                  <div className="group/tooltip flex flex-col items-center w-10 cursor-pointer">
                    <IoIosMore className="text-chinese-black text-[20px] font-bold opacity-0 group-hover:opacity-100 group-hover/tooltip:opacity-50 transition-all duration-200" />
                  </div>
                }
                tooltipLabel="More"
                items={[
                  {
                    label: "Add to Next up",
                    icon: <ListStart size={19} className="scale-x-[-1]" />,
                    onClick: () => console.log("next up"),
                  },
                  {
                    label: "Add to Playlist",
                    icon: (
                      <RiPlayListAddLine className="text-lg scale-x-[-1] scale-y-[-1]" />
                    ),
                    onClick: () => console.log("playlist"),
                  },
                ]}
              />
            </div>
          </div>

          {/* Title */}
          <a
            href="#"
            className="text-white-smoke no-underline hover:text-gray-300 text-[14px] font-bold tracking-tight pl-1 animate-fade-in"
          >
            {title}
          </a>

          {/* Artist */}
          <p className="text-silver text-[14px] font-bold pl-1 animate-fade-in">
            {artist}
          </p>
        </div>
      ) : (
        <div className="relative w-40 aspect-square rounded group cursor-pointer bg-off-black m-1 mb-1.75">
          {img && (
            <button
              className="absolute inset-0 bg-cover bg-center overflow-hidden rounded cursor-pointer"
              style={{ backgroundImage: `url(${img})` }}
            />
          )}
        </div>
      )}
    </>
  );
}
