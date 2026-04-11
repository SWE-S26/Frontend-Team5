"use client";

import { Avatar } from "antd";
import ProfilePopover from "./ProfilePopover";
import { PopoverProvider } from "./PopoverContext";

export default function FeedHeader() {
  const artistName = "KanYe";
  const followCount = 3528;
  const profileImgLink =
    "https://xsgames.co/randomusers/avatar.php?g=pixel&f=male";
  const location = "United States";

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
        </div>
      </div>
    </PopoverProvider>
  );
}
