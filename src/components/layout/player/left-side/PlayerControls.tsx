"use client";
import { IoPlaySkipBackSharp, IoPlaySkipForwardSharp } from "react-icons/io5";
import { IoIosPlay } from "react-icons/io";
import { GiPauseButton } from "react-icons/gi";
import { RiShuffleFill } from "react-icons/ri";

import { useAudioProgress } from "@/hooks/useAudioProgress";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { prev, next, toggleShuffle, cycleLoop, pause, play } from "@/store/slices/playerSlice";
import { set } from "zod";

type Props = {
  isPlaying: boolean;
  togglePlay: () => void;
};

export default function PlayerControls({ isPlaying, togglePlay }: Props) {
  const { shuffle, loop, tracks, currentTrackId } = useSelector((state: RootState) => state.player);
  const dispatch = useDispatch();

  const { currentTime, seekToPercentage } = useAudioProgress();

  function handlePrev() {
    if (!tracks.length) return;

    const currentIndex = tracks.findIndex((t) => t.id === currentTrackId);

    if (currentTime >= 5 || currentIndex === 0) {
      seekToPercentage(0);
      return;
    }

    dispatch(prev());
  }

  function handleNext() {
    if (!tracks.length) return;

    const currentIndex = tracks.findIndex((t) => t.id === currentTrackId);
    const isLast = currentIndex === tracks.length - 1;

    if (isLast && loop === "none") {
      dispatch(pause());
      return;
    }

    dispatch(next());
    dispatch(play());
  }

  return (
    <div className="flex items-center shrink-0">
      <div className="flex gap-2 sm:gap-4 pr-5 mx-3">
        <button onClick={handlePrev}>
          <IoPlaySkipBackSharp className="hover:text-silver cursor-pointer" size={25} />
        </button>

        <button
          onClick={togglePlay}
          className="relative group p-2 rounded-full bg-white-smoke transition flex items-center justify-center cursor-pointer hover:text-silver"
        >
          {isPlaying ? (
            <GiPauseButton className="w-4 h-4 text-chinese-black hover:text-silver ml-px" />
          ) : (
            <IoIosPlay className="w-4 h-4 text-chinese-black hover:text-silver ml-px" />
          )}
        </button>

        <button onClick={handleNext}>
          <IoPlaySkipForwardSharp className="hover:text-silver cursor-pointer" size={25} />
        </button>
      </div>

      <div className="flex sm:flex gap-4">
        <button
          onClick={() => dispatch(toggleShuffle())}
          className="relative group cursor-pointer hover:text-silver font-bold"
        >
          <RiShuffleFill size={15} className={shuffle ? "text-papaya" : ""} />
        </button>

        <button
          onClick={() => dispatch(cycleLoop())}
          className="relative group cursor-pointer hover:text-silver w-5 h-5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-1 -1 26 26"
            className={`w-5 h-5 fill-none stroke-current stroke-2 -scale-y-100 -scale-x-100 ${
              loop !== "none" ? "text-papaya" : "text-white-smoke"
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 4h-7a7 7 0 000 14h7a7 7 0 000-14z"
            />
            <polyline strokeLinecap="round" strokeLinejoin="round" points="14,1 17,4 14,7" />
          </svg>
          {loop === "one" && (
            <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-papaya text-chinese-black text-[6px] flex items-center justify-center leading-none pointer-events-none">
              1
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
