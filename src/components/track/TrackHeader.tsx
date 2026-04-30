"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import ColorThief from "color-thief-browser";
import { formatDistanceToNow } from "date-fns";
import { IoIosPlay } from "react-icons/io";
import { GiPauseButton } from "react-icons/gi";
import { GetTrackByIdResponse } from "@/types/tracks.types";
import SausageWaveform from "@/components/ui/SausageWaveform";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { play, pause, playAudio } from "@/store/slices/playerSlice";
import { useAudioProgress } from "@/hooks/useAudioProgress";

interface Props {
  track: GetTrackByIdResponse["data"] | null;
  loading: boolean;
  onTimeUpdate?: (time: number) => void;
  onRepeat?: (fn: () => void) => void;
}

export default function TrackHeader({ track, loading, onTimeUpdate, onRepeat }: Props) {
  const [gradient, setGradient] = useState("linear-gradient(to right, #4f46e5, #a855f7)");

  const dispatch = useDispatch();
  const { currentTrackId, isPlaying, loop } = useSelector((state: RootState) => state.player);
  const isThisTrackPlaying = currentTrackId === track?.trackId && isPlaying;

  const { progress, currentTime, seekToPercentage, dragStart, dragMove, dragEnd } = useAudioProgress();

  const trackMeta = {
    id: track?.trackId,
    url: track?.audio?.audioLink,
    title: track?.basicInfo?.title,
    artist: track?.basicInfo?.mainArtists?.join(", "),
    img: track?.image?.imgLink,
    duration: track?.durationInSeconds,
  };
  // Bubble currentTime up to Track page for CommentInput
  useEffect(() => {
    onTimeUpdate?.(currentTime);
  }, [currentTime]);

  // Register repeat function
  useEffect(() => {
    onRepeat?.(() => {
      if (!track?.trackId || !track?.audio?.audioLink) return;
      dispatch(playAudio({
        tracks: [{ id: track.trackId, url: track.audio.audioLink, title: track.basicInfo?.title, artist: track.basicInfo?.mainArtists?.join(", "), img: track.image?.imgLink }],
        startId: track.trackId,
      }));
      setTimeout(() => dispatch(play()), 0);
    });
  }, [track?.trackId]);

  // Gradient from track image
  useEffect(() => {
    const imageLink = track?.image?.imgLink;
    if (!imageLink) return;
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = imageLink;
    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const palette = colorThief.getPalette(img, 2);
        if (!palette || palette.length < 2) return;
        const [c1, c2] = palette;
        setGradient(`linear-gradient(to right, rgb(${c1.join(",")}), rgb(${c2.join(",")}))`);
      } catch (err) {
        console.error("Gradient extraction failed:", err);
      }
    };
  }, [track?.image?.imgLink]);

  const togglePlay = () => {
    if (!track?.trackId || !track?.audio?.audioLink) return;
    if (isThisTrackPlaying) {
      dispatch(pause());
      return;
    }
    if (currentTrackId === track.trackId) {
      // same track, just resume
      dispatch(play());
    } else {
      // new track — load it
      dispatch(playAudio({
        tracks: [{ id: track.trackId, url: track.audio.audioLink, title: track.basicInfo?.title, artist: track.basicInfo?.mainArtists?.join(", "), img: track.image?.imgLink }],
        startId: track.trackId,
      }));
      setTimeout(() => dispatch(play()), 0);
    }
  };

  const handleWaveformPlay = (seekPct?: number) => {
    if (!track?.trackId || !track?.audio?.audioLink) return;
    if (isThisTrackPlaying) return;
    dispatch(playAudio({
      tracks: [{ id: track.trackId, url: track.audio.audioLink, title: track.basicInfo?.title, artist: track.basicInfo?.mainArtists?.join(", "), img: track.image?.imgLink }],
      startId: track.trackId,
    }));
    setTimeout(() => {
      if (seekPct !== undefined) seekToPercentage(seekPct);
      dispatch(play());
    }, 100);
  };

  const duration = track?.durationInSeconds ?? 0;

  if (loading) return <div className="w-full h-100 bg-gray-900 animate-pulse" />;
  if (!track) return null;

  const timeAgo = track.releaseDate
    ? formatDistanceToNow(new Date(track.releaseDate), { addSuffix: true })
    : "";

  return (
    <div className="w-full mx-auto h-100 p-13 flex gap-12 shadow-lg" style={{ background: gradient }}>
      <div className="flex-1 text-white flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={togglePlay}
            className="relative group w-14 h-14 bg-chinese-black rounded-full flex items-center justify-center transition hover:scale-105 cursor-pointer"
          >
            <div className="absolute inset-0 rounded-full bg-black opacity-0 group-hover:opacity-10 transition" />
            {isThisTrackPlaying
              ? <GiPauseButton className="relative text-white-smoke w-7 h-7" />
              : <IoIosPlay className="relative text-white-smoke w-10 h-10 ml-0.5" />
            }
          </button>

          <div className="flex flex-col">
            <div className="flex items-center gap-25">
              <h1 className="text-3xl font-bold text-white bg-black px-3 py-2 w-auto">
                {track.basicInfo?.title}
              </h1>
              <div className="flex flex-col items-center justify-center mb-6 text-center">
                {timeAgo && <p className="text-m text-white px-2 py-2 whitespace-nowrap">{timeAgo}</p>}
                <div className="flex flex-wrap gap-1 justify-center">
                  {(track.basicInfo?.tags ?? []).map((tag: string) => (
                    <p key={tag} className="text-s bg-[#303030] text-white px-2 py-1 rounded-full w-fit">#{tag}</p>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-silver font-bold bg-black px-3 py-1 w-max">
              {(track.basicInfo?.mainArtists ?? []).join(", ")}
            </p>
          </div>
        </div>

        {/* Waveform pushed to bottom */}
        <div className="mt-auto">
          <SausageWaveform
            trackId={track.trackId}
            samplesUrl={track.audio.waveformLink}
            externalProgress={isThisTrackPlaying ? progress : 0}
            currentTime={currentTime}
            duration={duration}
            isPlaying={isThisTrackPlaying}
            onPlay={handleWaveformPlay}
            onSeek={seekToPercentage}
            onDragStart={dragStart}
            onDragMove={dragMove}
            onDragEnd={dragEnd}
            enabled={true}
          />
        </div>
      </div>

      <div className="w-81.25 h-81.25 relative rounded-xl overflow-hidden">
        <Image
          src={track.image?.imgLink || "/default-track.png"}
          alt="track cover"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}