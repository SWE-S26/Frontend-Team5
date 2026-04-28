"use client";

import MediaCardCarousel from "@/components/layout/track-cards/MediaCardCarousel";
import SuggestedWrapper from "@/components/social-graph/SuggestedWrapper";
import { useEffect } from "react";
import { useGetTracks } from "@/hooks/useTracks";

export default function HomeClient() {
  const {
    getTracks,
    loading: newTracksLoading,
    error,
    tracks,
  } = useGetTracks();

  useEffect(() => {
    getTracks(1, 100);
  }, [getTracks]);

  return (
    <div className="flex justify-between">
      <div className="w-full md:w-[68%]">
        <MediaCardCarousel
          title="Discover our newest tracks!"
          type="tracks"
          tracks={tracks ?? undefined}
          loading={newTracksLoading}
        />
      </div>
      <div className="hidden md:block md:w-[27.75%]">
        <SuggestedWrapper />
      </div>
    </div>
  );
}
