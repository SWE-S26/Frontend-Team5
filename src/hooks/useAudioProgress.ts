import { useEffect, useState, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { playerEngine } from "@/lib/playerEngine";

const SEEK_THROTTLE_MS = 100; // seek audio at most every 100ms while dragging

export function useAudioProgress() {
  const { isPlaying, currentTrackDuration } = useSelector(
    (state: RootState) => state.player,
  );
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(currentTrackDuration);

  const durationRef      = useRef(duration);
  const animFrameRef     = useRef<number | null>(null);
  const isDraggingRef    = useRef(false);
  const lastSeekTimeRef  = useRef(0); // timestamp of last throttled Howler seek

  useEffect(() => {
    if (currentTrackDuration > 0) {
      durationRef.current = currentTrackDuration;
      setDuration(currentTrackDuration);
    }
  }, [currentTrackDuration]);

  // RAF loop — skips setCurrentTime while dragging (drag manages it directly)
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      return;
    }

    const tick = () => {
      if (!isDraggingRef.current) {
        const time = playerEngine.getCurrentTime();
        const dur  = playerEngine.getDuration();
        setCurrentTime(time);
        if (dur > 0 && durationRef.current !== dur) {
          durationRef.current = dur;
          setDuration(dur);
        }
      }
      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [isPlaying]);

  // Freeze the RAF loop's position writes — called on mousedown
  const dragStart = useCallback(() => {
    isDraggingRef.current   = true;
    lastSeekTimeRef.current = 0; // allow immediate first seek
  }, []);

  // Called on every mousemove:
  //   - updates the time display immediately (smooth visual)
  //   - throttles the actual Howler seek to SEEK_THROTTLE_MS
  const dragMove = useCallback((percentage: number) => {
    const dur = durationRef.current;
    if (dur <= 0) return;

    // Always update the visual position
    setCurrentTime((percentage / 100) * dur);

    // Throttled audio seek — vinyl scrub without hammering Howler
    const now = performance.now();
    if (now - lastSeekTimeRef.current >= SEEK_THROTTLE_MS) {
      lastSeekTimeRef.current = now;
      playerEngine._seekPercentage(percentage);
    }
  }, []);

  // Called on mouseup — always commit a final seek to exact release position
  const dragEnd = useCallback((percentage: number) => {
    const dur = durationRef.current;
    if (dur > 0) setCurrentTime((percentage / 100) * dur);
    playerEngine._seekPercentage(percentage); // final precise seek
    isDraggingRef.current = false;
  }, []);

  // For instant click-to-seek (no drag)
  const seekToPercentage = useCallback((percentage: number) => {
    playerEngine._seekPercentage(percentage);
    const dur = durationRef.current;
    if (dur > 0) setCurrentTime((percentage / 100) * dur);
  }, []);

  const progress =
    durationRef.current > 0 ? (currentTime / durationRef.current) * 100 : 0;

  return { currentTime, duration, progress, dragStart, dragMove, dragEnd, seekToPercentage };
}