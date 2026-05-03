import { Avatar } from "antd";
import { TrackFan } from "@/types/tracks.types";
import { useState } from "react";
import { UserAddOutlined } from "@ant-design/icons";
import { GoMail } from "react-icons/go";
import NewMessagePopUp from "@/components/messages/NewMessagePopUP";

interface FanCardProps {
  fan: TrackFan;
  index: number;
  activeTab: string;
}

export default function FanCard({ fan, index, activeTab }: FanCardProps) {
  const [hovered, setHovered] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);

  return (
    <>
      <div
        className="flex items-center gap-2"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span className="text-white-smoke text-xs w-4 shrink-0">{index + 1}</span>
        <Avatar src={fan.userId.profileImg?.imgLink || undefined} size={28} className="shrink-0" />
        <span className="text-xs font-bold text-white-smoke flex-1 truncate">
          {fan.userId.displayName}
        </span>

        <div className="shrink-0 flex items-center gap-2">
          <span className="text-xs text-silver">
            {activeTab === "top"
              ? `${fan.totalNumberOfPlay} plays`
              : `${fan.firstWeekNumPlays} plays`}
          </span>
        </div>
      </div>
    </>
  );
}
