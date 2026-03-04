"use client";

import Card from "@/components/ui/Card";
import { time } from "console";
import { useRef, useState } from "react";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";

export default function MediaCardCarousel() {
  const cardData = [
    { img: "/ethan.jpg", title: "CRISPY CLOUD", artist: "Artist station" },
    { img: "/test.jpg", title: "CRISPY CLOUD", artist: "Artist station" },
    { img: "/Graduation.jpg", title: "CRISPY CLOUD", artist: "Artist station" },
    { img: "/ethan.jpg", title: "CRISPY CLOUD", artist: "Artist station" },
    { img: "/test.jpg", title: "CRISPY CLOUD", artist: "Artist station" },
    { img: "/Graduation.jpg", title: "CRISPY CLOUD", artist: "Artist station" },
    { img: "/ethan.jpg", title: "CRISPY CLOUD", artist: "Artist station" },
    { img: "/test.jpg", title: "CRISPY CLOUD", artist: "Artist station" },
    { img: "/Graduation.jpg", title: "CRISPY CLOUD", artist: "Artist station" },
    { img: "/ethan.jpg", title: "CRISPY CLOUD", artist: "Artist station" },
    { img: "/test.jpg", title: "CRISPY CLOUD", artist: "Artist station" },
    { img: "/Graduation.jpg", title: "CRISPY CLOUD", artist: "Artist station" },
    { img: "/ethan.jpg", title: "CRISPY CLOUD", artist: "Artist station" },
    { img: "/test.jpg", title: "CRISPY CLOUD", artist: "Artist station" },
    { img: "/Graduation.jpg", title: "CRISPY CLOUD", artist: "Artist station" },
    { img: "/ethan.jpg", title: "CRISPY CLOUD", artist: "Artist station" },
    { img: "/test.jpg", title: "CRISPY CLOUD", artist: "Artist station" },
    { img: "/Graduation.jpg", title: "CRISPY CLOUD", artist: "Artist station" },
  ];

  const carouselRef = useRef<HTMLDivElement>(null);

  const [isAtStart, setIsAtStart] = useState<boolean>(true);
  const [isAtEnd, setIsAtEnd] = useState<boolean>(false);
  const [isMoving, setIsMoving] = useState<"left" | "right" | false>(false);

  function scroll(direction: "left" | "right") {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -800 : 800;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  }

  function handleScroll() {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setIsAtStart(scrollLeft <= 5);
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 5);
    }
  }

  function handleMouseEnter(direction: "left" | "right") {
    if (isMoving) return;

    setIsMoving(direction);

    setTimeout(() => {
      setIsMoving(false);
    }, 200);
  }
  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4">
      {/* Title */}
      <h2 className="text-[22px] font-bold pb-4 text-white">Featured Tracks</h2>

      <div className="relative group/carousel">
        {/* Carousel Container */}
        <div
          ref={carouselRef}
          onScroll={handleScroll}
          className="overflow-x-auto no-scrollbar snap-x snap-mandatory"
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
            {cardData.map((card, index) => (
              <div key={index} className="snap-start flex-none">
                <Card img={card.img} title={card.title} artist={card.artist} />
              </div>
            ))}
          </div>
        </div>

        {!isAtEnd && (
          <button
            onClick={() => scroll("right")}
            onMouseEnter={() => handleMouseEnter("right")}
            className="flex group/right items-center justify-center absolute right-2 top-[105px] -translate-y-1/2 w-[33px] h-[33px] bg-[#303030] rounded-full z-10 cursor-pointer"
          >
            <HiOutlineChevronRight className="text-white text-l group-hover/right:text-[#838383]" />
          </button>
        )}

        {!isAtStart && (
          <button
            onClick={() => scroll("left")}
            onMouseEnter={() => handleMouseEnter("left")}
            className="flex group/left items-center justify-center absolute left-2 top-[105px] -translate-y-1/2 w-[33px] h-[33px] bg-[#303030] rounded-full z-10 cursor-pointer"
          >
            <HiOutlineChevronLeft className="text-white text-l group-hover/left:text-[#838383]" />
          </button>
        )}
      </div>
    </div>
  );
}
