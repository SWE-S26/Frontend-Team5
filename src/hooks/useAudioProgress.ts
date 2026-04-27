import { useEffect, useState, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { playerEngine } from "@/lib/playerEngine";

export function useAudioProgress() {
  const { isPlaying, currentTrackDuration } = useSelector(
    (state: RootState) => state.player,
  );
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(currentTrackDuration);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize duration from Redux when track changes
  useEffect(() => {
    if (currentTrackDuration > 0) {
      setDuration(currentTrackDuration);
    }
  }, [currentTrackDuration]);

  // Update progress smoothly on every frame while playing
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    // Set initial duration once
    const initialDuration = playerEngine.getDuration();
    if (initialDuration > 0 && duration === 0) {
      setDuration(initialDuration);
    }

    const updateProgress = () => {
      const time = playerEngine.getCurrentTime();
      const dur = playerEngine.getDuration();

      setCurrentTime(time);

      if (dur > 0 && duration !== dur) {
        setDuration(dur);
      }

      animationFrameRef.current = requestAnimationFrame(updateProgress);
    };

    animationFrameRef.current = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, duration]);

  // PUBLIC API: Seek to a percentage of the track (0-100)
  // This is the only way to seek - it keeps UI state in sync
  const seekToPercentage = useCallback((percentage: number) => {
    playerEngine._seekPercentage(percentage);
    const dur = playerEngine.getDuration();
    if (dur > 0) {
      setCurrentTime((percentage / 100) * dur);
    }
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return {
    currentTime,
    duration,
    progress,
    seekToPercentage,
  };
}
