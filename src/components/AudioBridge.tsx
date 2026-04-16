"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { playerEngine } from "@/lib/playerEngine";

export default function PlayerController() {
  const { tracks, currentTrackId, currentTrackUrl, isPlaying } = useSelector(
    (state: RootState) => state.player,
  );

  const track = tracks.find((t) => t.id === currentTrackId);
  // Use currentTrackUrl if available (set when playing from card), otherwise fall back to track.url
  const trackUrl = currentTrackUrl || track?.url;

  useEffect(() => {
    if (!trackUrl) return;

    // ALWAYS reload first
    playerEngine.load(trackUrl);

    // IMPORTANT: wait 50ms so Howler attaches properly
    setTimeout(() => {
      if (isPlaying) {
        playerEngine.play();
      }
    }, 50);
  }, [currentTrackId, currentTrackUrl]);

  useEffect(() => {
    if (!trackUrl) return;

    if (isPlaying) playerEngine.play();
    else playerEngine.pause();
  }, [isPlaying, trackUrl]);

  return null;
}
