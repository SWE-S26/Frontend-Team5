"use client";

import MediaCardCarousel from "@/components/layout/track-cards/MediaCardCarousel";
import SuggestedWrapper from "@/components/social-graph/SuggestedWrapper";
import { useEffect } from "react";
import { useGetTracks } from "@/hooks/useTracks";
import { useGetPlaylists, useGetPlaylistById } from "@/hooks/usePlaylists";

import { useGetFollowing } from "@/hooks/useSocial";

import { useAppSelector } from "@/store/hooks";
import PlaylistWaveformCard from "@/components/layout/track-cards/WaveformPlaylist";

export default function HomeClient() {
  const userId = useAppSelector((state) => state.auth.userId);

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

  const {
    getFollowing,
    loading,
    error: cantGetFollowing,
    following,
  } = useGetFollowing();

  const { getPlaylistById, error, playlist, hasFetched } = useGetPlaylistById();

  useEffect(() => {
    getTracks(1, 100);
    getPlaylists();
    getFollowing(userId ?? "");
    getPlaylistById("69f079f8841eeaca1786f763");
  }, [getTracks, getPlaylists, getFollowing, getPlaylistById]);

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

        <PlaylistWaveformCard
          img={playlist?.image.imgLink}
          title={playlist?.title}
          artist={playlist?.description}
          playlistId={playlist?._id}
          tag={playlist?.genre}
          likeCount={playlist?.numOfLikes}
          repostCount={playlist?.numOfReposts}
          isLikedByUser={playlist?.isLiked}
          isRepostedByUser={playlist?.isReposted}
          totalTracks={playlist?.totalTracks ?? playlist?.tracks?.length ?? 0}
          preloadedTracks={playlist?.tracks}
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
