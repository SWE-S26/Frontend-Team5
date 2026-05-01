"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Avatar } from "antd";
import { FaUser } from "react-icons/fa6";
import Button from "@/components/ui/Button";
import { usePopover } from "./PopoverContext";
import FollowButton from "@/components/ui/FollowButton";

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
  profileImgLink?: string;
  location?: string;
  profileHref?: string;
  followersHref?: string;
  userId?: string;         
  isFollowing?: boolean;
}

export default function ProfilePopover({
  id,
  children,
  artistName,
  followCount,
  profileImgLink,
  location,
  profileHref,
  followersHref,
  userId,
  isFollowing = false,
}: ProfilePopoverProps) {
  const { openId, setOpenId, scheduleClose, cancelClose } = usePopover();
  const isOpen = openId === id;
 
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
            className="z-9999 w-38 rounded border border-silver/50"
          >
            {/* Arrow */}
            <div
              ref={arrowRef}
              style={{
                left: arrowX != null ? `${arrowX}px` : "",
                top: arrowY != null ? `${arrowY}px` : "",
              }}
              className="absolute -top-1.25 w-3 h-3 bg-chinese-black border-l border-t border-silver/50 rotate-45"
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center p-4 bg-chinese-black rounded">
              <Avatar size={96} src={profileImgLink || undefined} />
              {profileHref ? (
                <Link
                  className="font-bold mt-2 text-white-smoke hover:text-silver transition-colors duration-100 ease-in-out"
                  href={profileHref}
                >
                  {artistName}
                </Link>
              ) : (
                <span className="font-bold mt-2 text-white-smoke">
                  {artistName}
                </span>
              )}
              {followersHref ? (
                <Link
                  className="text-gray-400 font-bold text-sm flex items-center gap-1 hover:opacity-50 transition duration-100 ease-in-out py-2"
                  href={followersHref}
                >
                  <FaUser /> {followCount.toLocaleString()}
                </Link>
              ) : (
                <span className="text-gray-400 font-bold text-sm flex items-center gap-1 py-2">
                  <FaUser /> {followCount.toLocaleString()}
                </span>
              )}
              {location && (
                <p className="text-gray-400 font-bold text-sm pb-2">
                  {location}
                </p>
              )}
              <FollowButton
                userId={userId}
                initialIsFollowing={isFollowing}
              />
            </div>
          </div>
        )}
      </FloatingPortal>
    </>
  );
}

