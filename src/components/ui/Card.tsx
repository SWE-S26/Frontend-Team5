"use client";
import { IoIosMore, IoMdHeart } from "react-icons/io";
import { IoMdPlay } from "react-icons/io";
import { HiHeart } from "react-icons/hi";

type CardProps = {
  img?: string;
  subtitle?: string;
  artist?: string;
};

export default function Card({
  img = "/test.jpg",
  subtitle = "CRISPY CLOUD",
  artist = "Artist station",
}: CardProps) {
  // Handler Functions
  function handleCardClick() {
    console.log("Card clicked!");
  }

  function handleLikeClick(e: React.MouseEvent) {
    e.stopPropagation();
    console.log("Like clicked!");
  }

  function handleMoreClick(e: React.MouseEvent) {
    e.stopPropagation();
    console.log("More options clicked!");
  }

  function handlePlayClick(e: React.MouseEvent) {
    e.stopPropagation();
    console.log("Play clicked!");
  }

  return (
    <>
      <div className="flex flex-col max-w-40">
        <div className="relative w-40 aspect-square rounded group cursor-pointer bg-[#303030] m-1 mb-1.75">
          {img && (
            <div
              className="absolute inset-0 bg-cover bg-center overflow-hidden rounded"
              style={{ backgroundImage: `url(${img})` }}
            />
          )}

          {img && (
            <div className="absolute inset-0 bg-white/50 opacity-0 group-hover:opacity-100" />
          )}

          {/* Play Button */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full z-20 opacity-0 group/play group-hover:opacity-100 flex items-center justify-center">
            <IoMdPlay
              className="text-black text-[38px] ml-1.5 group-hover/play:opacity-50"
              onClick={handlePlayClick}
            />
          </div>

          {/* Like Button */}
          <div className="absolute bottom-3.25 right-[48.5px] z-30 group/tooltip flex flex-col items-center w-10">
            <HiHeart
              className="text-black text-[16px] font-bold opacity-0 group-hover:opacity-100 group-hover/tooltip:opacity-50"
              onClick={handleLikeClick}
            />

            <div className="absolute top-full mt-2 px-2 py-1 bg-[#303030] text-white text-[11px] rounded opacity-0 group-hover/tooltip:opacity-100 pointer-events-none whitespace-nowrap z-50">
              Like
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-[#303030]" />
            </div>
          </div>

          {/* More Options Button */}
          <div className="absolute bottom-3.25 right-2.25 z-30 group/tooltip flex flex-col items-center w-10">
            <IoIosMore
              className="text-black text-[20px] font-bold opacity-0 group-hover:opacity-100 group-hover/tooltip:opacity-50"
              onClick={handleMoreClick}
            />

            <div className="absolute top-full mt-2 px-2 py-1 bg-[#303030] text-white text-[11px] rounded opacity-0 group-hover/tooltip:opacity-100 pointer-events-none whitespace-nowrap z-50">
              More
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-[#303030]"></div>
            </div>
          </div>
        </div>

        <a
          href="#"
          className="text-white no-underline hover:text-gray-300 text-[14px] font-bold tracking-tight"
        >
          {subtitle}
        </a>

        <p className="text-[#828282] text-[14px] font-bold"> {artist}</p>
      </div>
    </>
  );
}
