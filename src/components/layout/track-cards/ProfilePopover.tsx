"use client";

import { useState, useRef } from "react";
import { Avatar } from "antd";
import { FaUser } from "react-icons/fa6";
import Button from "@/components/ui/Button";
import { usePopover } from "./PopoverContext";
import {
  useFloating,
  useHover,
  useInteractions,
  useDismiss,
  FloatingPortal,
  offset,
  flip,
  shift,
  autoUpdate,
  arrow,
} from "@floating-ui/react";

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
  const { openId, setOpenId, scheduleClose, cancelClose } = usePopover();
  const isOpen = openId === id;
  const [isFollowing, setIsFollowing] = useState(false);
  const arrowRef = useRef(null);

  const { refs, floatingStyles, context, middlewareData } = useFloating({
    open: isOpen,
    onOpenChange: (open) => {
      if (open) {
        cancelClose();
        setOpenId(id);
      } else {
        scheduleClose();
      }
    },
    placement: "bottom",
    whileElementsMounted: autoUpdate,
    middleware: [offset(8), flip(), shift(), arrow({ element: arrowRef })],
  });

  const hover = useHover(context, { delay: { open: 0, close: 0 } });
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    dismiss,
  ]);

  const arrowX = middlewareData.arrow?.x;
  const arrowY = middlewareData.arrow?.y;

  return (
    <>
      <span
        ref={refs.setReference}
        {...getReferenceProps()}
        className="inline-block"
      >
        {children}
      </span>

      <FloatingPortal>
        {isOpen && (
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            className="z-[9999] w-38 rounded border border-silver/50"
          >
            {/* Arrow */}
            <div
              ref={arrowRef}
              style={{
                left: arrowX != null ? `${arrowX}px` : "",
                top: arrowY != null ? `${arrowY}px` : "",
              }}
              className="absolute -top-[5px] w-3 h-3 bg-chinese-black border-l border-t border-silver/50 rotate-45"
            />

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
              <Button
                className={`mt-2 w-full flex items-center justify-center text-center ${
                  isFollowing
                    ? "bg-off-black text-white-smoke"
                    : "bg-white-smoke text-chinese-black"
                }`}
                onClick={() => setIsFollowing((prev) => !prev)}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
            </div>
          </div>
        )}
      </FloatingPortal>
    </>
  );
}
