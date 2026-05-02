"use client";

import MediaCardCarousel from "@/components/layout/track-cards/MediaCardCarousel";
import SuggestedWrapper from "@/components/social-graph/SuggestedWrapper";
import SidebarFooter from "@/components/ui/SidebarFooter";
import { useEffect, useMemo } from "react";
import { useGetTracks } from "@/hooks/useTracks";
import { useGetPlaylists } from "@/hooks/usePlaylists";
import { useGetFollowing } from "@/hooks/useSocial";
import { useAppSelector } from "@/store/hooks";
import ArtistTools from "@/components/home/ArtistTools";
import LikedTracksWidget from "@/components/home/LikedTracksWidget";
import TrackHistoryWidget from "@/components/home/TrackHistoryWidget";

type FollowedUser = {
  userId: string;
  displayName: string;
};

function pickRandomUsers<T>(items: T[], count: number): T[] {
  const pool = [...items];
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
  }
  return pool.slice(0, Math.min(count, pool.length));
}

export default function HomeClient() {
  const userId = useAppSelector((state) => state.auth.userId);
  const isAuthenticated = useAppSelector(
    (state) => state.auth.isAuthenticated && state.auth.hasHydrated,
  );

  const {
    getTracks,
    loading: newTracksLoading,
    tracks: newTracks,
  } = useGetTracks();
  const {
    getPlaylists,
    loading: newPlaylistsLoading,
    playlists: newPlaylists,
  } = useGetPlaylists();
  const { getFollowing, loading, following } = useGetFollowing();

  const followedUsers = isAuthenticated
    ? ((following ?? []) as FollowedUser[])
    : [];

  const followedTrackUsers = useMemo(
    () =>
      !isAuthenticated
        ? []
        : pickRandomUsers(
            followedUsers.filter((user) =>
              newTracks?.some((track) => track.posterId === user.userId),
            ),
            3,
          ),
    [isAuthenticated, followedUsers, newTracks],
  );

  const followedPlaylistUsers = useMemo(
    () =>
      !isAuthenticated
        ? []
        : pickRandomUsers(
            followedUsers.filter((user) =>
              newPlaylists?.some(
                (playlist) => playlist.artistId === user.userId,
              ),
            ),
            3,
          ),
    [isAuthenticated, followedUsers, newPlaylists],
  );

  const followedTrackGroups = useMemo(
    () =>
      !isAuthenticated
        ? []
        : followedTrackUsers.map((user) => ({
            user,
            tracks:
              newTracks?.filter((track) => track.posterId === user.userId) ??
              [],
          })),
    [isAuthenticated, followedTrackUsers, newTracks],
  );

  const followedPlaylistGroups = useMemo(
    () =>
      !isAuthenticated
        ? []
        : followedPlaylistUsers.map((user) => ({
            user,
            playlists:
              newPlaylists?.filter(
                (playlist) => playlist.artistId === user.userId,
              ) ?? [],
          })),
    [isAuthenticated, followedPlaylistUsers, newPlaylists],
  );

  const followedTracksLoading = newTracksLoading || loading;
  const followedPlaylistsLoading = newPlaylistsLoading || loading;

  useEffect(() => {
    getTracks(1, 20);
    getPlaylists();
    if (isAuthenticated) getFollowing(userId ?? "");
  }, [getTracks, getPlaylists, getFollowing, userId, isAuthenticated]);

  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-6 px-4 sm:px-6 md:px-0 pb-3">
      {isAuthenticated && (
        <div className="order-first md:hidden w-full mb-2">
          <ArtistTools />
        </div>
      )}

      <div className="w-full md:w-[68%] space-y-4 md:space-y-6">
        <MediaCardCarousel
          title="Hear our freshly released tracks"
          type="tracks"
          tracks={newTracks ?? undefined}
          loading={newTracksLoading}
        />

        <MediaCardCarousel
          title="Discover our newest playlists"
          type="playlists"
          playlists={newPlaylists ?? undefined}
          loading={newPlaylistsLoading}
        />

        {isAuthenticated &&
          followedPlaylistGroups.map(({ user, playlists }) => (
            <MediaCardCarousel
              key={`playlists-${user.userId}`}
              title={`${user.displayName}'s playlist shelf`}
              type="playlists"
              playlists={playlists}
              loading={followedPlaylistsLoading}
            />
          ))}

        {isAuthenticated &&
          followedTrackGroups.map(({ user, tracks }) => (
            <MediaCardCarousel
              key={`tracks-${user.userId}`}
              title={`${user.displayName}'s track spotlight`}
              type="tracks"
              tracks={tracks}
              loading={followedTracksLoading}
            />
          ))}
      </div>

      <div className="w-full md:w-[27.75%]">
        <div className="w-full sticky top-4 md:top-20">
          {isAuthenticated && (
            <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
              <div className="hidden md:block">
                <ArtistTools />
              </div>
              <SuggestedWrapper />
              <LikedTracksWidget userId={userId} />
              <TrackHistoryWidget />
            </div>
          )}

          <SidebarFooter />
        </div>
      </div>
    </div>
  );
}
