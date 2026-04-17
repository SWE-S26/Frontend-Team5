import { use } from "react";
import TrackHeader from "@/components/track/TrackHeader";
import Navbar from "@/components/layout/navbar/main-navbar/Navbar";
import TrackSidebar from "@/components/track/TrackSidebar";
import ProfilePopover from "@/components/layout/track-cards/ProfilePopover";

export default function Track({
  params,
}: {
  params: Promise<{ trackid: string }>;
}) {
  const { trackid } = use(params);

  return (
    <div>
      <Navbar />
      <TrackHeader trackId={trackid} />
      
      <div className="w-[89%] flex justify-end">
        <div className="w-[320px]">
          <TrackSidebar />
        </div>
      </div>
      
    </div>
  );
}