"use client"

import { use } from "react";
import TrackHeader from "@/components/track/TrackHeader";
import Navbar from "@/components/layout/navbar/main-navbar/Navbar";
import TrackSidebar from "@/components/track/TrackSidebar";
import CommentInput from "@/components/track/CommentInput";
import CommentListProps from "@/components/track/CommentListProps";

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
      
      <div className="flex w-[80%] justify-between gap-8 mx-auto">
        {/* Left: Comments */}
        <div className="flex-1">
          <CommentInput trackId={trackid} />
          <CommentListProps trackId={trackid} />
        </div>

        {/* Right: Sidebar */}
        <div className="w-[340px] shrink-0">
          <TrackSidebar trackId={trackid} />
        </div>
      </div>
    </div>
  );
}