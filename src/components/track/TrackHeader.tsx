"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useGetTrackById } from "@/hooks/useTracks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTrack } from "@/store/slices/trackSlice";
import ColorThief from "color-thief-browser";
import { formatDistanceToNow } from "date-fns"
import { IoIosPlay } from "react-icons/io"
import { GiPauseButton } from "react-icons/gi"

interface Props {
  trackId: string;
}

export default function TrackHeader({ trackId }: Props) {
  const [isPlaying, setIsPlaying] = useState(false)
  const togglePlay = () => setIsPlaying((prev) => !prev)

  const dispatch = useAppDispatch();
  const track = useAppSelector((state) => state.track);

  const [gradient, setGradient] = useState(
    "linear-gradient(to right, #4f46e5, #a855f7)"
  );

  const { getTrackById, loading, error } = useGetTrackById();

  useEffect(() => {
    if (!trackId) return;

    const fetchTrack = async () => {
      try {
        const res = await getTrackById(trackId);
        if (!res?.data) return;

        const data = res.data;

        dispatch(
          setTrack({
            trackId: data.trackId,
            title: data.basicInfo.title,
            permalink: data.basicInfo.permalink,
            mainArtists: data.basicInfo.mainArtists,
            genre: data.basicInfo.genre,
            tags: data.basicInfo.tags,
            description: data.basicInfo.description,
            isPrivate: data.basicInfo.isPrivate,
            audioLink: data.audio.audioLink,
            audioId: data.audio.id,
            imageLink: data.image.imgLink,
            imagePublicId: data.image.publicId,
            likesCount: data.numLikes,
            playsCount: data.numPlays,
            repostsCount: data.numReposts,
            commentsCount: data.numComments,
            releaseDate: data.releaseDate,
          })
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchTrack();
  }, [trackId]);

  useEffect(() => {
    if (!track.imageLink) return;

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = track.imageLink;

    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const palette = colorThief.getPalette(img, 2);
        if (!palette || palette.length < 2) return;

        const [c1, c2] = palette;
        const color1 = `rgb(${c1[0]}, ${c1[1]}, ${c1[2]})`;
        const color2 = `rgb(${c2[0]}, ${c2[1]}, ${c2[2]})`;

        setGradient(`linear-gradient(to right, ${color1}, ${color2})`);
      } catch (err) {
        console.error("Gradient extraction failed:", err);
      }
    };

    img.onerror = () => {
      console.error("Image failed to load for gradient");
    };
  }, [track.imageLink]);

  // if (loading) {
  //   return <div className="w-full h-75 rounded-xl bg-gray-200 animate-pulse" />;
  // }

  if (error || !track.trackId) {
    return (
      <div className="w-full h-75 flex items-center justify-center text-red-500">
        Failed to load track
      </div>
    );
  }

  const timeAgo = track.releaseDate
    ? formatDistanceToNow(new Date(track.releaseDate), { addSuffix: true })
    : ""

  return (
    <div
      className="w-full mx-auto h-100 p-13 flex gap-12 shadow-lg"
      style={{ background: gradient }}
    >
      {/* LEFT */}
      <div className="flex-1 text-white">
        <div className="flex items-center gap-3 mb-25">
          <button
            onClick={togglePlay}
            className="relative group w-14 h-14 bg-chinese-black rounded-full flex items-center justify-center transition hover:scale-105 cursor-pointer"
          >
            <div className="absolute inset-0 rounded-full bg-black opacity-0 group-hover:opacity-10 transition" />
            {isPlaying ? (
              <GiPauseButton className="relative text-white-smoke w-7 h-7" />
            ) : (
              <IoIosPlay className="relative text-white-smoke w-10 h-10 ml-0.5" />
            )}
          </button>

          <div className="flex flex-col">
            <div className="flex items-center gap-25">
              <h1 className="text-3xl font-bold text-white bg-black px-3 py-2  w-auto">
                {track.title}
              </h1>

              <div className="flex flex-col items-center justify-center mb-6 text-center">
                {timeAgo && (
                  <p className="text-m text-white px-2 py-2 whitespace-nowrap">
                    {timeAgo}
                  </p>
                )}
                <div className="flex flex-wrap gap-1 justify-center">
                  {track.tags.map((tag) => (
                    <p
                      key={tag}
                      className="text-s bg-[#303030] text-white px-2 py-1 rounded-full w-fit"
                    >
                      #{tag}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-silver font-bold bg-black px-3 py-1 w-max">
              {track.mainArtists.join(", ")}
            </p>
          </div>
        </div>

        {/* Waveform */}
        <div className="w-full h-20 bg-white/30 rounded-md overflow-hidden flex items-end gap-0.5 px-1">
          {Array.from({ length: 120 }).map((_, i) => (
            <div
              key={i}
              className="w-0.5 bg-white/80"
              style={{ height: `${Math.random() * 100}%` }}
            />
          ))}
        </div>
      </div>

      {/* IMAGE */}
      <div className="w-81.25 h-81.25 relative rounded-xl overflow-hidden">
        <Image
          src={track.imageLink || "/default-track.png"}
          alt="track cover"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}