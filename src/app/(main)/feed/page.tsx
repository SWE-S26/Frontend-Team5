"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { ConfigProvider, Switch, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import WaveformCard from "@/components/layout/track-cards/WaveformCard";
import FeedHeader from "@/components/layout/track-cards/FeedHeader";
import { PopoverProvider } from "@/components/layout/track-cards/PopoverContext";
import FeedGuard from "./FeedGuard";

import { useGetFeed } from "@/hooks/useFeed";
import { tracksService } from "@/services/tracks.service";
import { Track as ApiTrack } from "@/types/tracks.types";
import { Track } from "@/store/slices/playerSlice";

const PAGE_SIZE = 10;

export default function Feed() {
  const { getFeed, items, loading: feedLoading, hasMore } = useGetFeed();

  const [allTracks, setAllTracks] = useState<ApiTrack[]>([]);
  const [resolving, setResolving] = useState(false);
  const [includeReposts, setIncludeReposts] = useState(true);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const seenIds = useRef<Set<string>>(new Set());
  const offsetRef = useRef(0);
  const isFetchingRef = useRef(false);

  const loadNextPage = useCallback(
    async (currentIncludeReposts: boolean) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      await getFeed(offsetRef.current, PAGE_SIZE, currentIncludeReposts);
      offsetRef.current += PAGE_SIZE;
      isFetchingRef.current = false;
    },
    [getFeed],
  );

  useEffect(() => {
    seenIds.current.clear();
    setAllTracks([]);
    offsetRef.current = 0;
    isFetchingRef.current = false;
    loadNextPage(includeReposts);
  }, [includeReposts]);

  useEffect(() => {
    if (!items.length) return;

    const freshIds = items
      .filter((item) => item.type === "track" && !seenIds.current.has(item.id))
      .map((item) => item.id);

    if (!freshIds.length) return;

    const resolve = async () => {
      setResolving(true);
      try {
        const settled = await Promise.allSettled(
          freshIds.map((id) => tracksService.getTrackById(id)),
        );
        const resolved: ApiTrack[] = [];
        settled.forEach((result, i) => {
          if (result.status === "fulfilled") {
            resolved.push(result.value.data.data);
            seenIds.current.add(freshIds[i]);
          }
        });
        setAllTracks((prev) => [...prev, ...resolved]);
      } finally {
        setResolving(false);
      }
    };

    resolve();
  }, [items]);

  // Single stable observer — reads latest state via refs, never re-attaches
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
  }, []); // intentionally empty — observer is set up once and reads via refs

  // Shared playlist across all cards
  const reduxTracks: Track[] = useMemo(
    () =>
      allTracks
        .filter((t) => !!t.trackId)
        .map((t) => ({
          id: t.trackId!,
          url: t.audio?.audioLink ?? "",
          title: t.basicInfo?.title,
          artist: t.basicInfo?.mainArtists?.[0],
          img: t.image?.imgLink,
          duration: t.durationInSeconds,
        })),
    [allTracks],
  );

  // Re-sort rendered cards to match feed order
  const orderedTracks = useMemo(() => {
    const idOrder = items
      .filter((item) => item.type === "track")
      .map((item) => item.id);
    return idOrder
      .map((id) => allTracks.find((t) => t.trackId === id))
      .filter(Boolean) as ApiTrack[];
  }, [allTracks, items]);

  const isLoading = feedLoading || resolving;
  const hasFetched = offsetRef.current > 0 || !isLoading;

  return (
    <FeedGuard>
      <div className="flex justify-between">
        <div className="w-full md:w-[68%]">
          <div className="flex items-center mb-4">
            <h2 className="flex-1 text-[22px] font-bold text-white-smoke text-tracking-[-0.02em]">
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
            {orderedTracks.map((track) => {
              const feedItem = items.find((i) => i.id === track.trackId);
              return (
                <div key={track.trackId} className="flex-none mb-4">
                  <PopoverProvider>
                    <FeedHeader
                      artistName={
                        track.basicInfo?.mainArtists?.[0] || "Unknown Artist"
                      }
                      actorId={feedItem?.actorId || "unknown"}
                      followCount={Math.floor(Math.random() * 10000)}
                      profileImgLink={
                        feedItem?.imgLink ||
                        "https://xsgames.co/randomusers/avatar.php?g=pixel&f=male"
                      }
                      location="United States"
                      releaseDate={track.releaseDate}
                      isRepost={feedItem?.isRepost ?? false}
                    />
                  </PopoverProvider>
                  <WaveformCard
                    img={track.image?.imgLink}
                    title={track.basicInfo?.title}
                    artist={track.basicInfo?.mainArtists?.[0]}
                    trackId={track.trackId ?? ""}
                    trackUrl={track.audio?.audioLink}
                    wfLink={track.audio?.waveformLink}
                    duration={track.durationInSeconds}
                    likeCount={track.numLikes}
                    repostCount={track.numReposts}
                    isLikedByUser={track.isLikedByUser}
                    allTracks={reduxTracks}
                  />
                </div>
              );
            })}
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

          {!isLoading && hasFetched && orderedTracks.length === 0 && (
            <p className="text-center text-silver text-sm py-8">
              Nothing to show here yet — follow some artists to see their posts.
            </p>
          )}

          {!hasMore && !isLoading && orderedTracks.length > 0 && (
            <p className="text-center text-silver text-sm py-8">
              You're all caught up
            </p>
          )}
        </div>
        <div className="hidden md:block md:w-[27.75%]" />
      </div>
    </FeedGuard>
  );
}
