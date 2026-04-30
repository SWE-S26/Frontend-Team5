"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ColorThief from "color-thief-browser";
import { formatDistanceToNow } from "date-fns";
import { IoIosPlay } from "react-icons/io";
import { GiPauseButton } from "react-icons/gi";
import { GetTrackByIdResponse } from "@/types/tracks.types";

interface Props {
  track: GetTrackByIdResponse["data"] | null
  loading: boolean
}

export default function TrackHeader({ track, loading }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gradient, setGradient] = useState("linear-gradient(to right, #4f46e5, #a855f7)");

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

  if (loading) {
    return <div className="w-full h-100 bg-gray-900 animate-pulse" />;
  }

  if (!track) return null;

  const timeAgo = track.releaseDate
    ? formatDistanceToNow(new Date(track.releaseDate), { addSuffix: true })
    : "";

  const imageLink = track.image?.imgLink;
  const title = track.basicInfo?.title;
  const mainArtists = track.basicInfo?.mainArtists ?? [];
  const tags = track.basicInfo?.tags ?? [];

  return (
    <div
      className="w-full mx-auto h-100 p-13 flex gap-12 shadow-lg"
      style={{ background: gradient }}
    >
      <div className="flex-1 text-white">
        <div className="flex items-center gap-3 mb-25">
          <button
            onClick={() => setIsPlaying(p => !p)}
            className="relative group w-14 h-14 bg-chinese-black rounded-full flex items-center justify-center transition hover:scale-105 cursor-pointer"
          >
            <div className="absolute inset-0 rounded-full bg-black opacity-0 group-hover:opacity-10 transition" />
            {isPlaying
              ? <GiPauseButton className="relative text-white-smoke w-7 h-7" />
              : <IoIosPlay className="relative text-white-smoke w-10 h-10 ml-0.5" />
            }
          </button>

          <div className="flex flex-col">
            <div className="flex items-center gap-25">
              <h1 className="text-3xl font-bold text-white bg-black px-3 py-2 w-auto">
                {title}
              </h1>
              <div className="flex flex-col items-center justify-center mb-6 text-center">
                {timeAgo && (
                  <p className="text-m text-white px-2 py-2 whitespace-nowrap">{timeAgo}</p>
                )}
                <div className="flex flex-wrap gap-1 justify-center">
                  {tags.map((tag: string) => (
                    <p key={tag} className="text-s bg-[#303030] text-white px-2 py-1 rounded-full w-fit">
                      #{tag}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-silver font-bold bg-black px-3 py-1 w-max">
              {mainArtists.join(", ")}
            </p>
          </div>
        </div>

        <div className="w-full h-20 bg-white/30 rounded-md overflow-hidden flex items-end gap-0.5 px-1">
          {Array.from({ length: 120 }).map((_, i) => (
            <div key={i} className="w-0.5 bg-white/80" style={{ height: `${Math.random() * 100}%` }} />
          ))}
        </div>
      </div>

      <div className="w-81.25 h-81.25 relative rounded-xl overflow-hidden">
        <Image
          src={imageLink || "/default-track.png"}
          alt="track cover"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}