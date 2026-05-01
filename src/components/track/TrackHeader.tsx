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
  const { currentTrackId, isPlaying } = useSelector((state: RootState) => state.player);
  const isThisTrackPlaying = currentTrackId === track?.trackId && isPlaying;

  const { progress, currentTime, seekToPercentage, dragStart, dragMove, dragEnd } = useAudioProgress();

  useEffect(() => {
    onTimeUpdate?.(currentTime);
  }, [currentTime]);

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
      dispatch(play());
    } else {
      dispatch(playAudio({
        tracks: [{ id: track.trackId, url: track.audio.audioLink, title: track.basicInfo?.title, artist: track.basicInfo?.mainArtists?.join(", "), img: track.image?.imgLink }],
        startId: track.trackId,
      }));
      setTimeout(() => dispatch(play()), 0);
    }
  };

  const handleWaveformPlay = (seekPct?: number) => {
    if (!track?.trackId || !track?.audio?.audioLink || isThisTrackPlaying) return;
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

  if (loading) return <div className="w-full h-48 sm:h-64 md:h-80 lg:h-100 bg-gray-900 animate-pulse" />;
  if (!track) return null;

  const timeAgo = track.releaseDate
    ? formatDistanceToNow(new Date(track.releaseDate), { addSuffix: true })
    : "";

  return (
        <div
      className="w-full mx-auto p-4 sm:p-6 md:p-10 lg:p-13 flex flex-row gap-4 sm:gap-6 lg:gap-12 shadow-lg min-h-48 sm:min-h-64 md:min-h-80 lg:min-h-100"
      style={{ background: gradient }}
    >
      {/* Left — info + waveform */}
      <div className="flex-1 min-w-0 text-white-smoke flex flex-col">
        <div className="flex items-start gap-3 mb-4 sm:mb-6">
          <button
            onClick={togglePlay}
            className="relative group shrink-0 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-chinese-black rounded-full flex items-center justify-center transition hover:scale-105 cursor-pointer"
          >
            <div className="absolute inset-0 rounded-full bg-chinese-black opacity-0 group-hover:opacity-10 transition" />
            {isThisTrackPlaying
              ? <GiPauseButton className="relative text-white-smoke w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
              : <IoIosPlay className="relative text-white-smoke w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 ml-0.5" />
            }
          </button>

          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex flex-wrap items-start gap-2 sm:gap-4">
              <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white-smoke bg-chinese-black px-2 sm:px-3 py-1 sm:py-2 truncate max-w-full">
                {track.basicInfo?.title}
              </h1>
              <div className="flex flex-col items-start justify-center">
                {timeAgo && (
                  <p className="text-xs sm:text-sm text-white-smoke px-2 py-1 whitespace-nowrap">{timeAgo}</p>
                )}
                <div className="flex flex-wrap gap-1">
                  {(track.basicInfo?.tags ?? []).map((tag: string) => (
                    <p key={tag} className="text-xs bg-off-black text-white-smoke px-2 py-1 rounded-full w-fit">
                      #{tag}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-silver font-bold bg-chinese-black px-2 sm:px-3 py-1 w-max text-sm sm:text-base mt-1 truncate max-w-full">
              {(track.basicInfo?.mainArtists ?? []).join(", ")}
            </p>
          </div>
        </div>

        {/* Waveform pushed to bottom */}
        <div className="mt-auto">
          <SausageWaveform
            trackId={track.trackId}
            samplesUrl={track.audio.waveformLink}
            externalProgress={ progress}
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

      {/* Right — cover image always visible, scales down on small screens */}
      <div className="w-20 h-20 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-81.25 lg:h-81.25 relative rounded-xl overflow-hidden shrink-0 self-center sm:self-start">
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