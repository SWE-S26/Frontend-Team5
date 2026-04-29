"use client";

import TrackCard from "@/components/ui/TrackCard";
import PlaylistCard from "@/components/ui/PlaylistCard";
import { useRef, useState } from "react";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";

type TrackItem = {
  trackId?: string;
  basicInfo?: { title?: string; mainArtists?: string[] };
  audio?: { audioLink?: string };
  image?: { imgLink?: string };
  durationInSeconds?: number;
  isLikedByUser?: boolean;
};

type PlaylistItem = {
  _id?: string;
  title: string;
  description: string;
  image: { imgLink: string };
  isLiked?: boolean;
};

type Props = {
  title?: string;
  type: "tracks" | "playlists";
  tracks?: TrackItem[];
  playlists?: PlaylistItem[];
  loading?: boolean;
};

export default function MediaCardCarousel({
  title = "More of what you like",
  type,
  tracks,
  playlists,
  loading,
}: Props) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const lockAnimationRef = useRef<boolean>(false);

  const [isAtStart, setIsAtStart] = useState<boolean>(true);
  const [isAtEnd, setIsAtEnd] = useState<boolean>(false);
  const [isMoving, setIsMoving] = useState<"left" | "right" | false>(false);

  function scroll(direction: "left" | "right") {
    if (!carouselRef.current) return;
    const scrollAmount = direction === "left" ? -737 : 737;
    carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  }

  function handleButtonsVisiblity() {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setIsAtStart(scrollLeft <= 5);
    setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 5);
  }

  function handleMouseEnter(direction: "left" | "right") {
    if (isMoving || lockAnimationRef.current) return;
    setIsMoving(direction);
    lockAnimationRef.current = true;
    setTimeout(() => {
      setIsMoving(false);
      setTimeout(() => {
        lockAnimationRef.current = false;
      }, 300);
    }, 200);
  }

  const tracksToPlaylist = tracks?.map((track) => ({
    id: track.trackId ?? "",
    url: track.audio?.audioLink ?? "",
    title: track.basicInfo?.title,
    artist: track.basicInfo?.mainArtists?.length
      ? track.basicInfo.mainArtists.join(", ")
      : "Unknown Artist",
    img: track.image?.imgLink || undefined,
    duration: track.durationInSeconds,
  }));

  const skeletonCards = Array.from({ length: 6 });

  return (
    <div className="sm:w-1/5 md:w-full max-w-6xl mb-10">
      <h2 className="text-[22px] font-bold pb-4 text-white-smoke">{title}</h2>
      <div className="relative group/carousel">
        <div
          ref={carouselRef}
          onScroll={handleButtonsVisiblity}
          className="overflow-x-auto no-scrollbar"
        >
          <div
            className={`flex gap-8 pb-4 transition-transform duration-250 ease-in-out ${
              isMoving === "right"
                ? "-translate-x-3"
                : isMoving === "left"
                  ? "translate-x-3"
                  : "translate-x-0"
            }`}
          >
            {loading
              ? skeletonCards.map((_, index) => (
                  <div key={index} className="flex-none">
                    <TrackCard />
                  </div>
                ))
              : type === "tracks"
                ? tracks?.map((track) => (
                    <div key={track.trackId} className="flex-none">
                      <TrackCard
                        img={track.image?.imgLink || undefined}
                        title={track.basicInfo?.title}
                        artist={
                          track.basicInfo?.mainArtists?.length
                            ? track.basicInfo.mainArtists.join(", ")
                            : "Unknown Artist"
                        }
                        trackId={track.trackId}
                        trackUrl={track.audio?.audioLink}
                        duration={track.durationInSeconds}
                        isLikedByUser={track.isLikedByUser}
                        allTracks={tracksToPlaylist}
                      />
                    </div>
                  ))
                : playlists?.map((playlist) => (
                    <div key={playlist._id} className="flex-none">
                      <PlaylistCard
                        img={playlist.image?.imgLink || undefined}
                        title={playlist.title}
                        artist={playlist.description}
                        playlistId={playlist._id}
                        isLikedByUser={playlist.isLiked}
                      />
                    </div>
                  ))}
          </div>
        </div>

        {!isAtEnd && (
          <button
            onClick={() => scroll("right")}
            onMouseEnter={() => handleMouseEnter("right")}
            className="flex group/right items-center justify-center absolute right-2 top-[105px] -translate-y-1/2 w-[33px] h-[33px] bg-off-black rounded-full z-10 cursor-pointer"
          >
            <HiOutlineChevronRight className="text-white-smoke text-l group-hover/right:text-[#838383]" />
          </button>
        )}

        {!isAtStart && (
          <button
            onClick={() => scroll("left")}
            onMouseEnter={() => handleMouseEnter("left")}
            className="flex group/left items-center justify-center absolute left-2 top-[105px] -translate-y-1/2 w-[33px] h-[33px] bg-off-black rounded-full z-10 cursor-pointer"
          >
            <HiOutlineChevronLeft className="text-white-smoke text-l group-hover/left:text-[#838383]" />
          </button>
        )}
      </div>
    </div>
  );
}
