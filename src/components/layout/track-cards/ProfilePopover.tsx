"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Avatar } from "antd";
import { FaUser } from "react-icons/fa6";
import Button from "@/components/ui/Button";
import { usePopover } from "./PopoverContext";

interface ProfilePopoverProps {
  id: string;
  children: React.ReactNode;
  artistName: string;
  followCount: number;
  profileImgLink: string;
  location: string;
}

export default function ProfilePopover({
  id,
  children,
  artistName,
  followCount,
  profileImgLink,
  location,
}: ProfilePopoverProps) {
  const { openId, setOpenId, hideTimer } = usePopover();
  const isVisible = openId === id;

  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [isFollowing, setIsFollowing] = useState(false);

  const triggerRef = useRef<HTMLSpanElement>(null);

  function toggleFollow() {
    setIsFollowing((prev) => !prev);
  }

  function showPopover() {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setCoords({
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX + rect.width / 2,
    });
    setOpenId(id);
  }

  function hidePopover() {
    hideTimer.current = setTimeout(() => setOpenId(null), 200);
  }

  function cancelHide() {
    if (hideTimer.current) clearTimeout(hideTimer.current);
  }

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={showPopover}
        onMouseLeave={hidePopover}
        className="inline-block"
      >
        {children}
      </span>

      {isVisible &&
        createPortal(
          <div
            onMouseEnter={cancelHide}
            onMouseLeave={hidePopover}
            style={{
              top: coords.top,
              left: coords.left,
              transform: "translateX(-50%)",
            }}
            className="fixed z-[9999] w-38 rounded border border-silver/50"
          >
            {/* Arrow */}
            <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-3 h-3 bg-off-black border-l border-t border-silver/50 rotate-45" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center p-4 bg-chinese-black rounded">
              <Avatar size={96} src={profileImgLink} />
              <a
                className="font-bold mt-2 text-white-smoke hover:text-silver transition-colors duration-100 ease-in-out"
                href="#"
              >
                {artistName}
              </a>
              <a
                className="text-gray-400 font-bold text-sm flex items-center gap-1 hover:opacity-50 transition duration-100 ease-in-out py-2"
                href="#"
              >
                <FaUser /> {followCount.toLocaleString()}
              </a>
              {location && (
                <p className="text-gray-400 font-bold text-sm pb-2">
                  {location}
                </p>
              )}
              {isFollowing ? (
                <Button
                  className="mt-2 w-full bg-off-black text-white-smoke flex items-center justify-center text-center"
                  onClick={toggleFollow}
                >
                  Following
                </Button>
              ) : (
                <Button
                  className="mt-2 w-full bg-white-smoke text-chinese-black flex items-center justify-center text-center"
                  onClick={toggleFollow}
                >
                  Follow
                </Button>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
