"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { playerEngine } from "@/lib/playerEngine";
import { usePlayerPersistence } from "@/hooks/usePlayerPersistence";
import { next } from "@/store/slices/playerSlice";

export default function PlayerController() {
  usePlayerPersistence();
  const dispatch = useDispatch();

  const { tracks, currentTrackId, currentTrackUrl, isPlaying, volume, loop } =
    useSelector((state: RootState) => state.player);

  const track = tracks.find((t) => t.id === currentTrackId);
  const trackUrl = currentTrackUrl || track?.url;

  useEffect(() => {
    if (!trackUrl) return;
    playerEngine.load(trackUrl, () => {
      dispatch(next());
    });
    playerEngine.setVolume(volume / 100);
  }, [currentTrackId, currentTrackUrl]);

  useEffect(() => {
    if (!trackUrl) return;
    if (isPlaying) playerEngine.play();
    else playerEngine.pause();
  }, [isPlaying, trackUrl]);

  useEffect(() => {
    playerEngine.setVolume(volume / 100);
  }, [volume]);

  useEffect(() => {
    playerEngine.setLoop(loop);
  }, [loop]);

  return null;
}
