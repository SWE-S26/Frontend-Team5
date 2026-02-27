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
        <div className="relative w-40 aspect-square rounded overflow-hidden group cursor-pointer bg-[#303030] m-1 mb-1.75">
          {img && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${img})` }}
            />
          )}

          {img && (
            <div className="absolute inset-0 bg-white/50 opacity-0 group-hover:opacity-100" />
          )}

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full z-20 opacity-0 group-hover:opacity-100 flex items-center justify-center">
            <IoMdPlay
              className="text-black text-[38px] ml-1.5 hover:opacity-50"
              onClick={handlePlayClick}
            />
          </div>

          <HiHeart
            className="absolute bottom-3.25 right-15 text-black z-10 text-[15px] font-bold opacity-0 group-hover:opacity-100 hover:opacity-50"
            onClick={handleLikeClick}
          />

          <IoIosMore
            className="absolute bottom-3.25 right-4.5 text-black z-10 text-[20px] font-bold opacity-0 group-hover:opacity-100 hover:opacity-50"
            onClick={handleMoreClick}
          />
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
