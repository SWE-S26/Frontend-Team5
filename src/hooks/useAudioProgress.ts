import { useEffect, useState, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { playerEngine } from "@/lib/playerEngine";

export function useAudioProgress() {
  const { isPlaying } = useSelector((state: RootState) => state.player);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const animationFrameRef = useRef<number | null>(null);

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

  // Seek to a percentage of the track
  const seek = useCallback((percentage: number) => {
    playerEngine.seek(percentage);
    const newTime = (percentage / 100) * playerEngine.getDuration();
    setCurrentTime(newTime);
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return {
    currentTime,
    duration,
    progress,
    seek,
  };
}
