"use client";

import { useState } from "react";
import { IoIosHeart } from "react-icons/io";
import { MdPersonAddAlt1 } from "react-icons/md";
import { BsPersonCheckFill } from "react-icons/bs";

type PlayerNextUpProps = {
  hasTrackInfo?: boolean;
};

const slideRightAnimation = `
  @keyframes slideRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(60px);
      opacity: 1;
    }
  }
`;

export default function PlayerNextUp({
  hasTrackInfo = false,
}: PlayerNextUpProps) {
  const [liked, setLiked] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [added, setAdded] = useState(false);

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    if (newLiked) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 6000);
    }
  };

  return (
    <div
      className="flex items-center gap-4 sm:gap-6 text-white-smoke shrink-0"
      style={
        hasTrackInfo
          ? {
              animation: "slideRight 0.3s ease-out forwards",
            }
          : {}
      }
    >
      <style>{slideRightAnimation}</style>

      <button
        onClick={handleLike}
        className={`${liked ? "text-anger" : "text-white-smoke"} cursor-pointer hover:text-silver`}
      >
        <IoIosHeart size={16} />
      </button>

      {/* Toast */}
      <div
        className={`fixed top-23 right-6 border border-silver bg-off-black text-white-smoke px-2 py-2 rounded shadow-lg flex items-center gap-3 transform transition-all duration-300 ease-out ${showToast ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8 pointer-events-none"}`}
      >
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF7MG32vJAUlDYjqVgOEN8EQp1MFWX7_dqAw&s"
          className="w-15 h-15 rounded object-cover"
        />
        <div>
          <p className="font-semibold">ياه - تامر عاشور - Tamer Ashour</p>
          <p className="text-sm text-gray-400">
            was saved to{" "}
            <span className="font-semibold text-white-smoke">
              your Library.
            </span>
          </p>
        </div>
      </div>

      <button
        onClick={() => setAdded(!added)}
        className="relative group cursor-pointer hover:text-silver"
      >
        {added ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-5 h-5 fill-current text-anger"
          >
            {/* Person head */}
            <circle cx="10" cy="7.5" r="3.5" />
            {/* Person body */}
            <path d="M2 20h16c0-4.4-3.6-8-8-8s-8 3.6-8 8z" />
            {/* Check mark */}
            <path
              d="M16 9l2.5 2.5 4-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-5 h-5 fill-current"
          >
            {/* Person head */}
            <circle cx="10" cy="7.5" r="3.5" />
            {/* Person body */}
            <path d="M2 20h16c0-4.4-3.6-8-8-8s-8 3.6-8 8z" />
            {/* Plus sign */}
            <path d="M19 8v2.5h2.5v1.5H19v2.5h-1.5V12h-2.5v-1.5h2.5V8H19z" />
          </svg>
        )}
      </button>

      <button className="relative group cursor-pointer hover:text-silver">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-1 -1 26 26"
          className="font-bold w-3 h-4 fill-current stroke-current"
        >
          <polygon points="2,2 2,10 8,6" />
          <line
            x1="11"
            y1="6"
            x2="24"
            y2="6"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1="2"
            y1="14"
            x2="24"
            y2="14"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1="2"
            y1="20"
            x2="24"
            y2="20"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#f3f3f3] text-chinese-black text-xs border border-gray-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50">
          Next Up
        </span>
      </button>
    </div>
  );
}
