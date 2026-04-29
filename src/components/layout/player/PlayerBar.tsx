"use client";

import { useEffect } from "react";
import PlayerControls from "./left-side/PlayerControls";
import PlayerProgress from "./left-side/PlayerProgress";
import PlayerVolume from "./left-side/PlayerVolume";
import PlayerTrackInfo from "./right-side/PlayerTrackInfo";
import PlayerNextUp from "./right-side/PlayerNextUp";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { play, pause, setVolume, setTrackDuration } from "@/store/slices/playerSlice";
import { useAudioProgress } from "@/hooks/useAudioProgress";

const slideUpAnimation = `
  @keyframes slideUp {
    from { transform: translateY(100%); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }
`;

export default function PlayerBar() {
  const dispatch = useDispatch();
  const { isPlaying, volume, currentTrackArtist, currentTrackTitle, currentTrackImage } =
    useSelector((state: RootState) => state.player);

  const { currentTime, duration, dragStart, dragMove, dragEnd } = useAudioProgress();

  const togglePlay = () => {
    if (isPlaying) { dispatch(pause()); return; }
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

  return (
    <>
      <style>{slideUpAnimation}</style>
      <div
        className="hidden md:flex justify-center fixed bottom-0 w-full h-11.75 bg-off-black z-1000"
        style={{ animation: "slideUp 0.4s ease-out forwards" }}
      >
        <div className="flex items-center w-full max-w-302 justify-between">
          <div className="flex w-[68%]">
            <div className="pr-5">
              <PlayerControls isPlaying={isPlaying} togglePlay={togglePlay} />
            </div>
            <div className="flex">
              <PlayerProgress
                currentTime={currentTime}
                duration={duration}
                onDragStart={dragStart}
                onDragMove={dragMove}
                onDragEnd={dragEnd}
                formatTime={formatTime}
              />
              <PlayerVolume volume={volume} setVolume={(v) => dispatch(setVolume(v))} />
            </div>
          </div>
          <div className="flex pr-5 py-2 w-[27.75%]">
            <PlayerTrackInfo
              title={currentTrackTitle}
              artist={currentTrackArtist}
              img={currentTrackImage}
            />
            <PlayerNextUp hasTrackInfo={!!(currentTrackTitle || currentTrackArtist || currentTrackImage)} />
          </div>
        </div>
      </div>
    </>
  );
}