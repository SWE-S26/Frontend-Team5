"use client";

import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { playerEngine } from "@/lib/playerEngine";
import { usePlayerPersistence } from "@/hooks/usePlayerPersistence";
import { next } from "@/store/slices/playerSlice";
import { tracksService } from "@/services/tracks.service";
import { Howler } from "howler";

const LISTEN_THRESHOLD_SECONDS = 15;
Howler.html5PoolSize = 1;

export default function PlayerController() {
  usePlayerPersistence();
  const dispatch = useDispatch();
  const listenTrackedForCurrentRef = useRef(false);
  const historyTrackedForCurrentRef = useRef(false);
  const listenTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    listenTrackedForCurrentRef.current = false;
    historyTrackedForCurrentRef.current = false;
    if (listenTimerRef.current) {
      clearInterval(listenTimerRef.current);
      listenTimerRef.current = null;
    }
  }, [currentTrackId]);

  useEffect(() => {
    if (
      !isPlaying ||
      !currentTrackId ||
      !trackUrl ||
      listenTrackedForCurrentRef.current
    ) {
      if (listenTimerRef.current) {
        clearInterval(listenTimerRef.current);
        listenTimerRef.current = null;
      }
      return;
    }

    listenTimerRef.current = setInterval(() => {
      const currentTime = playerEngine.getCurrentTime();
      if (
        currentTime < LISTEN_THRESHOLD_SECONDS ||
        listenTrackedForCurrentRef.current
      ) {
        return;
      }

      listenTrackedForCurrentRef.current = true;
      if (listenTimerRef.current) {
        clearInterval(listenTimerRef.current);
        listenTimerRef.current = null;
      }

      if (!historyTrackedForCurrentRef.current) {
        historyTrackedForCurrentRef.current = true;
        void tracksService
          .addTrackToHistory(currentTrackId)
          .catch(() => undefined);
      }
      void tracksService
        .incrementPlayCount(currentTrackId)
        .catch(() => undefined);
    }, 1000);

    return () => {
      if (listenTimerRef.current) {
        clearInterval(listenTimerRef.current);
        listenTimerRef.current = null;
      }
    };
  }, [isPlaying, currentTrackId, trackUrl]);

  useEffect(() => {
    playerEngine.setVolume(volume / 100);
  }, [volume]);

  useEffect(() => {
    playerEngine.setLoop(loop);
  }, [loop]);

  useEffect(() => {
    return () => {
      if (listenTimerRef.current) {
        clearInterval(listenTimerRef.current);
      }
    };
  }, []);

  return null;
}
