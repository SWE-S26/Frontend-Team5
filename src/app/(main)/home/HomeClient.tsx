"use client";

import MediaCardCarousel from "@/components/layout/track-cards/MediaCardCarousel";
import SuggestedWrapper from "@/components/social-graph/SuggestedWrapper";
import { useEffect } from "react";
import { useGetTracks } from "@/hooks/useTracks";
import { useGetPlaylists } from "@/hooks/usePlaylists";

export default function HomeClient() {
  const {
    getTracks,
    loading: newTracksLoading,
    error: newTracksError,
    tracks: newTracks,
  } = useGetTracks();

  const {
    getPlaylists,
    loading: newPlaylistsLoading,
    error: newPlaylistsError,
    playlists: newPlaylists,
  } = useGetPlaylists();

  useEffect(() => {
    getTracks(1, 100);
    getPlaylists();
  }, [getTracks, getPlaylists]);

  return (
    <div className="flex justify-between">
      <div className="w-full md:w-[68%]">
        <MediaCardCarousel
          title="Discover our newest tracks!"
          type="tracks"
          tracks={newTracks ?? undefined}
          loading={newTracksLoading}
        />

        <MediaCardCarousel
          title="Discover our newest playlists!"
          type="playlists"
          playlists={newPlaylists ?? undefined}
          loading={newPlaylistsLoading}
        />
      </div>
      <div className="hidden md:block md:w-[27.75%]">
        <SuggestedWrapper />
      </div>
    </div>
  );
}
