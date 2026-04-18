"use client";

import { Avatar } from "antd";
import ProfilePopover from "./ProfilePopover";
import { PopoverProvider } from "./PopoverContext";

type FeedHeaderProps = {
  artistName: string;
  followCount: number;
  profileImgLink: string;
  location: string;
  releaseDate?: string;
};

export default function FeedHeader({
  artistName,
  followCount,
  profileImgLink,
  location,
  releaseDate,
}: FeedHeaderProps) {
  function timeAgo(dateStr: string): string {
    const seconds = Math.floor(
      (Date.now() - new Date(dateStr).getTime()) / 1000,
    );

    if (seconds < 60) return "just now";

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "week", seconds: 604800 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1)
        return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
    }

    return "just now";
  }

  return (
    <PopoverProvider>
      <div className="flex items-center py-4">
        <ProfilePopover
          id="avatar"
          artistName={artistName}
          followCount={followCount}
          profileImgLink={profileImgLink}
          location={location}
        >
          <Avatar src={profileImgLink} />
        </ProfilePopover>

        <div className="text-sm text-silver cursor-text pl-3">
          <ProfilePopover
            id="name"
            artistName={artistName}
            followCount={followCount}
            profileImgLink={profileImgLink}
            location={location}
          >
            <a className="text-white-smoke hover:text-silver font-bold transition-colors duration-200 ease-in-out cursor-pointer">
              {artistName}
            </a>
          </ProfilePopover>{" "}
          posted a track
          {releaseDate && <span className="ml-1">{timeAgo(releaseDate)}</span>}
        </div>
      </div>
    </PopoverProvider>
  );
}
