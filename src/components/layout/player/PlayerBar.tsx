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
  next,
  prev,
} from "@/store/slices/playerSlice";
import { useAudioProgress } from "@/hooks/useAudioProgress";
import { IoIosPlay } from "react-icons/io";
import { GiPauseButton } from "react-icons/gi";
import { IoPlaySkipBackSharp, IoPlaySkipForwardSharp } from "react-icons/io5";

const slideUpAnimation = `
  @keyframes slideUp {
    from { transform: translateY(100%); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
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

  const { currentTime, duration, dragStart, dragMove, dragEnd } =
    useAudioProgress();

  const togglePlay = () => {
    if (isPlaying) {
      dispatch(pause());
      return;
    }
    setTimeout(() => dispatch(play()), 0);
  };

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  useEffect(() => {
    if (duration > 0) dispatch(setTrackDuration(duration));
  }, [duration, dispatch]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <style>{slideUpAnimation}</style>

      {/* ── MOBILE BAR (< md) ─────────────────────────────────────────── */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-[9999]"
        style={{ animation: "slideUp 0.4s ease-out forwards" }}
      >
        <div className="flex items-center h-16 bg-off-black px-4 gap-3">
          {/* Album art */}
          {currentTrackImage ? (
            <img
              src={currentTrackImage}
              alt="cover"
              className="w-11 h-11 rounded-md object-cover shrink-0"
            />
          ) : (
            <div className="w-11 h-11 rounded-md bg-white-smoke/10 shrink-0" />
          )}

          {/* Track info + inline progress */}
          <div className="flex flex-col min-w-0 flex-1 overflow-hidden gap-1">
            <span className="text-white-smoke text-sm font-bold truncate leading-tight">
              {currentTrackTitle ?? "Nothing playing"}
            </span>
            {currentTrackArtist && (
              <span className="text-silver text-xs truncate leading-tight">
                {currentTrackArtist}
              </span>
            )}
            {/* Progress bar in the middle */}
            <div className="w-full h-[2px] bg-white-smoke/15 rounded-full mt-1">
              <div
                className="h-full rounded-full transition-[width] duration-300 ease-linear"
                style={{ width: `${progress}%`, background: "var(--inferno, #ff4500)" }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => dispatch(prev())}
              className="p-2 text-white-smoke active:text-silver transition"
              aria-label="Previous"
            >
              <IoPlaySkipBackSharp size={20} />
            </button>

            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-white-smoke flex items-center justify-center active:bg-silver transition shrink-0"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <GiPauseButton className="w-4 h-4 text-chinese-black" />
              ) : (
                <IoIosPlay className="w-4 h-4 text-chinese-black ml-px" />
              )}
            </button>

            <button
              onClick={() => { dispatch(next()); dispatch(play()); }}
              className="p-2 text-white-smoke active:text-silver transition"
              aria-label="Next"
            >
              <IoPlaySkipForwardSharp size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* ── TABLET + DESKTOP BAR (≥ md) ───────────────────────────────── */}
      <div
        className="hidden md:flex fixed bottom-0 left-0 right-0 h-[47px] bg-off-black z-[9999] items-center justify-center"
        style={{ animation: "slideUp 0.4s ease-out forwards" }}
      >
        <div className="flex items-center w-[85%] gap-2 lg:gap-4">
          <div className="shrink-0">
            <PlayerControls isPlaying={isPlaying} togglePlay={togglePlay} />
          </div>

          <div className="flex items-center flex-1 min-w-0">
            <PlayerProgress
              currentTime={currentTime}
              duration={duration}
              onDragStart={dragStart}
              onDragMove={dragMove}
              onDragEnd={dragEnd}
              formatTime={formatTime}
            />
          </div>

          <div className="flex items-center gap-2 lg:gap-3 shrink-0">
            <div className="hidden lg:block">
              <PlayerVolume
                volume={volume}
                setVolume={(v) => dispatch(setVolume(v))}
              />
            </div>

            <div className="hidden lg:block">
              <PlayerTrackInfo
                title={currentTrackTitle}
                artist={currentTrackArtist}
                img={currentTrackImage}
              />
            </div>

            <PlayerNextUp hasTrackInfo={false} />
          </div>
        </div>
      </div>
    </>
  );
}
