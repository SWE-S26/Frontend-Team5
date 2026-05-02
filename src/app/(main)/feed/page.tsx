"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { ConfigProvider, Switch, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import WaveformCard from "@/components/layout/track-cards/WaveformCard";
import PlaylistWaveformCard from "@/components/layout/track-cards/WaveformPlaylist";
import FeedHeader from "@/components/layout/track-cards/FeedHeader";
import { PopoverProvider } from "@/components/layout/track-cards/PopoverContext";
import FeedGuard from "./FeedGuard";

import { useGetFeed } from "@/hooks/useFeed";
import { tracksService } from "@/services/tracks.service";
import { playlistsService } from "@/services/playlists.service";
import { Track as ApiTrack } from "@/types/tracks.types";
import { PlaylistDetail } from "@/types/playlists.types";
import { Track } from "@/store/slices/playerSlice";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { playAudio } from "@/store/slices/playerSlice";
import ArtistTools from "@/components/home/ArtistTools";
import SuggestedWrapper from "@/components/social-graph/SuggestedWrapper";
import SidebarFooter from "@/components/ui/SidebarFooter";
import TrackHistoryWidget from "@/components/home/TrackHistoryWidget";
import LikedTracksWidget from "@/components/home/LikedTracksWidget";
import { useAppSelector } from "@/store/hooks";
import Suggested from "@/components/social-graph/Suggested";

const PAGE_SIZE = 10;

export default function Feed() {
  const userId = useAppSelector((state) => state.auth.userId);

  const { getFeed, items, loading: feedLoading, hasMore } = useGetFeed();

  const [allTracks, setAllTracks] = useState<ApiTrack[]>([]);
  const [allPlaylists, setAllPlaylists] = useState<PlaylistDetail[]>([]);
  const [playlistCreators, setPlaylistCreators] = useState<
    Record<string, string>
  >({});
  const [resolving, setResolving] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const [includeReposts, setIncludeReposts] = useState(true);

  const dispatch = useDispatch();
  const currentTrackId = useSelector(
    (state: RootState) => state.player.currentTrackId,
  );

  const sentinelRef = useRef<HTMLDivElement>(null);
  const seenIds = useRef<Set<string>>(new Set());
  const seenPlaylistIds = useRef<Set<string>>(new Set());
  const offsetRef = useRef(0);
  const isFetchingRef = useRef(false);
  const prevQueueLengthRef = useRef(0);

  const loadNextPage = useCallback(
    async (currentIncludeReposts: boolean) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      await getFeed(offsetRef.current, PAGE_SIZE, currentIncludeReposts);
      offsetRef.current += PAGE_SIZE;
      isFetchingRef.current = false;
      setHasFetched(true);
    },
    [getFeed],
  );

  useEffect(() => {
    seenIds.current.clear();
    seenPlaylistIds.current.clear();
    setAllTracks([]);
    setAllPlaylists([]);
    setPlaylistCreators({});
    setHasFetched(false);
    setResolving(true);
    offsetRef.current = 0;
    isFetchingRef.current = false;
    prevQueueLengthRef.current = 0;
    loadNextPage(includeReposts);
  }, [includeReposts]);

  useEffect(() => {
    if (!items.length) {
      setResolving(false);
      return;
    }

    const freshTrackIds = items
      .filter((item) => item.type === "track" && !seenIds.current.has(item.id))
      .map((item) => item.id);

    const freshPlaylistIds = items
      .filter(
        (item) =>
          item.type === "playlist" && !seenPlaylistIds.current.has(item.id),
      )
      .map((item) => item.id);

    if (!freshTrackIds.length && !freshPlaylistIds.length) {
      setResolving(false);
      return;
    }

    const resolve = async () => {
      setResolving(true);
      try {
        const [trackResults, playlistResults] = await Promise.all([
          freshTrackIds.length
            ? Promise.allSettled(
                freshTrackIds.map((id) => tracksService.getTrackById(id)),
              )
            : Promise.resolve([]),
          freshPlaylistIds.length
            ? Promise.allSettled(
                freshPlaylistIds.map((id) =>
                  playlistsService.getPlaylistById(id),
                ),
              )
            : Promise.resolve([]),
        ]);

        const resolvedTracks: ApiTrack[] = [];
        (trackResults as PromiseSettledResult<any>[]).forEach((result, i) => {
          if (result.status === "fulfilled") {
            resolvedTracks.push(result.value.data.data);
            seenIds.current.add(freshTrackIds[i]);
          }
        });

        const resolvedPlaylists: PlaylistDetail[] = [];
        (playlistResults as PromiseSettledResult<any>[]).forEach(
          (result, i) => {
            if (result.status === "fulfilled") {
              const pl = result.value.data?.data?.playlist;
              const detail = Array.isArray(pl) ? pl[0] : pl;
              if (detail) {
                resolvedPlaylists.push(detail);
                seenPlaylistIds.current.add(freshPlaylistIds[i]);
              }
            }
          },
        );

        const uniqueArtistIds = Array.from(
          new Set(
            resolvedPlaylists
              .map((playlist) => playlist.artistId)
              .filter(Boolean),
          ),
        );
        const creatorResults = await Promise.allSettled(
          uniqueArtistIds.map(async (artistId) => {
            const response =
              await playlistsService.getPublicPlaylistCreator(artistId);
            const artist = response.data.data.artist;
            const creator = Array.isArray(artist)
              ? (artist[0] ?? null)
              : artist;
            return creator ? ([artistId, creator.displayName] as const) : null;
          }),
        );

        const nextCreators: Record<string, string> = {};
        creatorResults.forEach((result) => {
          if (result.status !== "fulfilled" || !result.value) return;
          const [artistId, displayName] = result.value;
          nextCreators[artistId] = displayName;
        });

        if (resolvedTracks.length)
          setAllTracks((prev) => [...prev, ...resolvedTracks]);
        if (resolvedPlaylists.length)
          setAllPlaylists((prev) => [...prev, ...resolvedPlaylists]);
        if (Object.keys(nextCreators).length) {
          setPlaylistCreators((prev) => ({ ...prev, ...nextCreators }));
        }
      } finally {
        setResolving(false);
      }
    };

    resolve();
  }, [items]);

  const hasMoreRef = useRef(hasMore);
  const resolvingRef = useRef(resolving);
  const includeRepostsRef = useRef(includeReposts);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);
  useEffect(() => {
    resolvingRef.current = resolving;
  }, [resolving]);
  useEffect(() => {
    includeRepostsRef.current = includeReposts;
  }, [includeReposts]);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          !isFetchingRef.current &&
          !resolvingRef.current &&
          hasMoreRef.current
        ) {
          loadNextPage(includeRepostsRef.current);
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  const fullQueue = useMemo(() => {
    const queue: Track[] = [];
    for (const item of items) {
      if (item.type === "track") {
        const track = allTracks.find((t) => t.trackId === item.id);
        if (track?.trackId)
          queue.push({
            id: track.trackId,
            url: track.audio?.audioLink ?? "",
            title: track.basicInfo?.title,
            artist: track.basicInfo?.mainArtists?.[0],
            img: track.image?.imgLink,
            duration: track.durationInSeconds,
          });
      } else if (item.type === "playlist") {
        const playlist = allPlaylists.find((p) => p._id === item.id);
        playlist?.tracks?.forEach((t) =>
          queue.push({
            id: t._id,
            url: t.audio.audioLink,
            title: t.basicInfo.title,
            artist: t.basicInfo.mainArtists[0],
            img: t.image.imgLink,
            duration: t.durationInSeconds,
          }),
        );
      }
    }
    return queue;
  }, [items, allTracks, allPlaylists]);

  useEffect(() => {
    if (fullQueue.length <= prevQueueLengthRef.current) return;
    prevQueueLengthRef.current = fullQueue.length;
    if (!currentTrackId) return;
    if (!fullQueue.some((t) => t.id === currentTrackId)) return;
    dispatch(playAudio({ tracks: fullQueue, startId: currentTrackId }));
  }, [fullQueue]);

  const orderedItems = useMemo(() => {
    const seen = new Set<string>();
    return items
      .filter((item) => item.type === "track" || item.type === "playlist")
      .filter((item) => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      })
      .map((item) => {
        if (item.type === "track") {
          const track = allTracks.find((t) => t.trackId === item.id);
          return track
            ? { type: "track" as const, data: track, feedItem: item }
            : null;
        } else {
          const playlist = allPlaylists.find((p) => p._id === item.id);
          return playlist
            ? { type: "playlist" as const, data: playlist, feedItem: item }
            : null;
        }
      })
      .filter(Boolean) as {
      type: "track" | "playlist";
      data: any;
      feedItem: any;
    }[];
  }, [allTracks, allPlaylists, items]);

  const isLoading = feedLoading || resolving;

  return (
    <FeedGuard>
      <div className="flex justify-between">
        <div className="w-full md:w-[68%]">
          <div className="flex items-center mb-4 justify-between">
            <h2 className="text-sm sm:text-[22px] font-bold text-white-smoke text-tracking-[-0.02em] text-center sm:text-left flex-1">
              Hear the latest posts from the people you're following:
            </h2>
            <div className="flex items-center gap-2">
              <p className="text-sm font-small text-silver cursor-default">
                Reposts
              </p>
              <ConfigProvider
                theme={{
                  components: {
                    Switch: {
                      colorPrimary: "var(--inferno)",
                      colorPrimaryHover: "var(--inferno)",
                      colorTextQuaternary: "var(--silver)",
                      colorTextTertiary: "var(--silver)",
                      handleBg: "var(--bg)",
                    },
                  },
                }}
              >
                <Switch
                  defaultChecked
                  onChange={(checked) => setIncludeReposts(checked)}
                />
              </ConfigProvider>
            </div>
          </div>

          <div>
            {orderedItems.map((item) => (
              <div key={item.feedItem.id} className="flex-none mb-4">
                <FeedHeader
                  artistName={item.feedItem?.displayName || "Unknown Artist"}
                  actorId={item.feedItem?.actorId || "unknown"}
                  followCount={item.feedItem?.followCount ?? 0}
                  profileImgLink={
                    item.feedItem?.imgLink ||
                    "https://xsgames.co/randomusers/avatar.php?g=pixel&f=male"
                  }
                  location="United States"
                  releaseDate={
                    item.type === "track"
                      ? item.data.releaseDate
                      : item.data.createdAt
                  }
                  isRepost={item.feedItem?.isRepost ?? false}
                />

                {item.type === "track" ? (
                  <WaveformCard
                    img={item.data.image?.imgLink}
                    title={item.data.basicInfo?.title}
                    artist={item.data.basicInfo?.mainArtists?.[0]}
                    artistId={item.data.posterId}
                    trackId={item.data.trackId ?? ""}
                    trackUrl={item.data.audio?.audioLink}
                    wfLink={item.data.audio?.waveformLink}
                    duration={item.data.durationInSeconds}
                    tag={item.data.basicInfo?.tags?.[0]}
                    audioClipStart={item.data.audioClip?.start}
                    audioClipEnd={item.data.audioClip?.end}
                    likeCount={item.data.numLikes}
                    repostCount={item.data.numReposts}
                    playsCount={item.data.numPlays}
                    commentsCount={item.data.numComments}
                    isLikedByUser={item.data.isLikedByUser}
                    isRepostedByUser={item.data.isRepostedByUser}
                    allTracks={fullQueue}
                    enableDirectDownload={
                      item.data.permissions?.enableDirectDownload ?? false
                    }
                    isRepost={item.feedItem?.isRepost ?? false}
                    reposterId={item.feedItem?.actorId}
                    reposterName={item.feedItem?.displayName}
                  />
                ) : (
                  <PlaylistWaveformCard
                    img={item.data.image?.imgLink}
                    title={item.data.title}
                    artist={
                      playlistCreators[item.data.artistId] ??
                      item.data.artistId ??
                      "Unknown creator"
                    }
                    artistId={item.data.artistId}
                    playlistId={item.data._id}
                    tag={item.data.genre}
                    likeCount={item.data.numOfLikes}
                    repostCount={item.data.numOfReposts}
                    isLikedByUser={item.data.isLiked}
                    isRepostedByUser={item.data.isReposted}
                    preloadedTracks={item.data.tracks}
                    totalTracks={item.data.totalTracks}
                    feedQueue={fullQueue}
                    isRepost={item.feedItem?.isRepost ?? false}
                    reposterId={item.feedItem?.actorId}
                    reposterName={item.feedItem?.displayName}
                  />
                )}
              </div>
            ))}
          </div>

          <div ref={sentinelRef} />

          {isLoading && (
            <div className="flex justify-center py-8">
              <ConfigProvider theme={{ token: { colorPrimary: "var(--fg)" } }}>
                <Spin
                  indicator={
                    <LoadingOutlined spin style={{ color: "var(--fg)" }} />
                  }
                  size="large"
                />
              </ConfigProvider>
            </div>
          )}

          {!isLoading && hasFetched && orderedItems.length === 0 && (
            <div>
              <p className="text-center font-extrabold text-md py-8 max-w-150 mx-auto">
                Your feed is currently empty. Go to{" "}
                <a
                  href="/search"
                  className="text-blue-500 hover:text-blue-400 transition"
                >
                  search
                </a>
                ,{" "}
                <a
                  href="/home"
                  className="text-blue-500 hover:text-blue-400 transition"
                >
                  home
                </a>{" "}
                or use the suggestions below to find creators to follow. Refresh
                the page to see tracks they are posting.
              </p>
              <div className="mx-auto max-w-100">
                <Suggested DISPLAY_COUNT={10} />
              </div>
            </div>
          )}

          {!hasMore && !isLoading && orderedItems.length > 0 && (
            <p className="text-center text-silver text-sm py-8">
              You're all caught up
            </p>
          )}
        </div>

        <div className="hidden md:block md:w-[27.75%]">
          <div className="w-full">
            <div className="w-full flex flex-col items-center mb-5">
              <div className="w-full">
                <ArtistTools />
              </div>
              <div className="w-full">
                <SuggestedWrapper />
                <LikedTracksWidget userId={userId} />
                <TrackHistoryWidget />
                <div className="mt-8">
                  <SidebarFooter />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FeedGuard>
  );
}
