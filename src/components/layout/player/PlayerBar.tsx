"use client";

import { useEffect } from "react";
import PlayerControls from "./left-side/PlayerControls";
import PlayerProgress from "./left-side/PlayerProgress";
import PlayerVolume from "./left-side/PlayerVolume";
import PlayerTrackInfo from "./right-side/PlayerTrackInfo";
import PlayerNextUp from "./right-side/PlayerNextUp";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  play,
  pause,
  setVolume,
  setTrackDuration,
} from "@/store/slices/playerSlice";
import { useAudioProgress } from "@/hooks/useAudioProgress";
import { playerEngine } from "@/lib/playerEngine";

const slideUpAnimation = `
  @keyframes slideUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes slideRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(60px);
      opacity: 1;
    }
  }
`;

export default function PlayerBar() {
  const dispatch = useDispatch();

  const {
    isPlaying,
    volume,
    currentTrackArtist,
    currentTrackTitle,
    currentTrackImage,
  } = useSelector((state: RootState) => state.player);

  const { currentTime, duration, seekToPercentage } = useAudioProgress();

  const togglePlay = () => {
    if (isPlaying) {
      dispatch(pause());
      return;
    }

    setTimeout(() => {
      dispatch(play());
    }, 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    // Convert raw time value to percentage (0-100) for seek
    if (duration > 0) {
      const percentage = (time / duration) * 100;
      seekToPercentage(percentage);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleVolume = (v: number) => {
    dispatch(setVolume(v));
  };

  // Persist duration to Redux whenever it changes
  useEffect(() => {
    if (duration > 0) {
      dispatch(setTrackDuration(duration));
    }
  }, [duration, dispatch]);

  return (
    <>
      <style>{slideUpAnimation}</style>
      <div
        className="hidden md:flex justify-center fixed bottom-0 w-full h-11.75 bg-off-black z-1000"
        style={{
          animation: "slideUp 0.4s ease-out forwards",
        }}
      >
        <div className="flex items-center w-full max-w-302 justify-between">
          {/* Left-Side */}
          <div className="flex w-[68%]">
            <div className="pr-5">
              <PlayerControls isPlaying={isPlaying} togglePlay={togglePlay} />
            </div>

            <div className="flex">
              <PlayerProgress
                currentTime={currentTime}
                duration={duration}
                handleSeek={handleSeek}
                formatTime={formatTime}
              />
              <PlayerVolume volume={volume} setVolume={handleVolume} />
            </div>
          </div>

          {/* Right-Side */}
          <div className="flex pr-5 py-2 w-[27.75%]">
            <PlayerTrackInfo
              title={currentTrackTitle}
              artist={currentTrackArtist}
              img={currentTrackImage}
            />
            <PlayerNextUp
              hasTrackInfo={
                !!(currentTrackTitle || currentTrackArtist || currentTrackImage)
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}
