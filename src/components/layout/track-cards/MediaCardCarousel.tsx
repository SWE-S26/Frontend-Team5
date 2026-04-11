"use client";

import Card from "@/components/ui/Card";
import { useGetTracks } from "@/hooks/useTracks";
import { useEffect, useRef, useState } from "react";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";

export default function MediaCardCarousel() {
  const { getTracks, loading, error, tracks } = useGetTracks();

  useEffect(() => {
    getTracks(1, 20);
  }, [getTracks]);

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

  const skeletonCards = Array.from({ length: 6 });

  return (
    <div className="sm:w-1/5 md:w-full max-w-6xl py-8">
      {" "}
      {/* OM - removed this from className (mx-auto px-4) for alignment purposes, re-add them to see yourself */}
      {/* Title */}
      <h2 className="text-[22px] font-bold pb-4 text-white-smoke">
        More of what you like
      </h2>
      <div className="relative group/carousel">
        {/* Carousel Container */}
        <div
          ref={carouselRef}
          onScroll={handleButtonsVisiblity}
          className="overflow-x-auto no-scrollbar"
        >
          {/* Animation Wrapper */}
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
                    <Card />{" "}
                  </div>
                ))
              : tracks?.map((track) => (
                  <div key={track._id} className="flex-none">
                    <Card
                      img={track.image.imgLink || undefined}
                      title={track.basicInfo.title}
                      artist={track.basicInfo.mainArtists[0]}
                      trackId={track._id}
                    />
                  </div>
                ))}
          </div>
        </div>

        {/* Right Button */}
        {!isAtEnd && (
          <button
            onClick={() => scroll("right")}
            onMouseEnter={() => handleMouseEnter("right")}
            className="flex group/right items-center justify-center absolute right-2 top-[105px] -translate-y-1/2 w-[33px] h-[33px] bg-off-black rounded-full z-10 cursor-pointer"
          >
            <HiOutlineChevronRight className="text-white-smoke text-l group-hover/right:text-[#838383]" />
          </button>
        )}

        {/* Left Button */}
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
