"use client";

import { Avatar } from "antd";
import ProfilePopover from "./ProfilePopover";
import { PopoverProvider } from "./PopoverContext";

import { LuRepeat2 } from "react-icons/lu";

type FeedHeaderProps = {
  artistName: string;
  actorId: string;
  followCount: number;
  profileImgLink: string;
  location: string;
  releaseDate?: string;
  isRepost: boolean;
};

export default function FeedHeader({
  artistName,
  actorId,
  followCount,
  profileImgLink,
  location,
  releaseDate,
  isRepost,
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
          id={actorId}
          artistName={artistName}
          followCount={followCount}
          profileImgLink={profileImgLink}
          location={location}
        >
          <Avatar src={profileImgLink} />
        </ProfilePopover>

        <div className="flex items-center text-sm text-silver cursor-text pl-3">
          <ProfilePopover
            id="avatar"
            artistName={artistName}
            followCount={followCount}
            profileImgLink={profileImgLink}
            location={location}
          >
            <a className="text-white-smoke hover:text-silver font-bold transition-colors duration-200 ease-in-out cursor-pointer mr-1">
              {artistName}
            </a>
          </ProfilePopover>
          <span className="inline-flex items-center gap-1">
            {isRepost ? (
              <>
                {" "}
                <LuRepeat2 className="text-[16px]" />
                reposted
              </>
            ) : (
              " posted"
            )}
          </span>
          {releaseDate && <span className="ml-1">{timeAgo(releaseDate)}</span>}
        </div>
      </div>
    </PopoverProvider>
  );
}
