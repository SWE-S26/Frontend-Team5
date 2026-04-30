"use client";

import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { playerEngine } from "@/lib/playerEngine";
import { usePlayerPersistence } from "@/hooks/usePlayerPersistence";
import { next } from "@/store/slices/playerSlice";
import { tracksService } from "@/services/tracks.service";
import { Howler } from "howler";

Howler.html5PoolSize = 1;

export default function PlayerController() {
  usePlayerPersistence();
  const dispatch = useDispatch();
  const listenTrackedForCurrentRef = useRef(false);
  const historyTrackedForCurrentRef = useRef(false);
  const listenTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { tracks, currentTrackId, currentTrackUrl, isPlaying, volume, loop, currentTrackDuration } =
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
      const duration = currentTrackDuration > 0 ? currentTrackDuration : playerEngine.getDuration();
      const threshold = Math.ceil(duration * 0.3);

      if (currentTime < threshold || listenTrackedForCurrentRef.current) {
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

      const dur = duration || 0;
      let listenedDuration = Math.floor(currentTime);
      if (dur > 0 && listenedDuration > dur) listenedDuration = Math.floor(dur);

      const generateUUID = () => {
        try {
          if (typeof crypto !== "undefined" && typeof (crypto as any).randomUUID === "function") {
            return (crypto as any).randomUUID();
          }
        } catch (e) {}
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = (Math.random() * 16) | 0;
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
      };

      const sessionIdPlay = generateUUID();

      void tracksService
        .incrementPlayCount({ trackId: currentTrackId, listenedDuration, sessionIdPlay })
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
