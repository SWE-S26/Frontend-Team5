"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { ConfigProvider, Switch, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import WaveformCard from "@/components/layout/track-cards/WaveformCard";
import FeedHeader from "@/components/layout/track-cards/FeedHeader";
import { PopoverProvider } from "@/components/layout/track-cards/PopoverContext";
import FeedGuard from "./FeedGuard";

import { useGetTracks } from "@/hooks/useTracks";
import { Track } from "@/store/slices/playerSlice";
import { Track as ApiTrack } from "@/types/tracks.types";

const PAGE_SIZE = 5;

export default function Feed() {
  const { getTracks, loading, tracks, paginationInfo } = useGetTracks();

  const [allTracks, setAllTracks] = useState<ApiTrack[]>([]);
  const [page, setPage] = useState(1);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasNext = paginationInfo?.hasNext ?? true;

  useEffect(() => {
    getTracks(page, PAGE_SIZE);
  }, [page]);

  useEffect(() => {
    if (!tracks) return;
    setAllTracks((prev) =>
      page === 1
        ? tracks
        : [
            ...prev,
            ...tracks.filter((t) => !prev.some((p) => p.trackId === t.trackId)),
          ],
    );
  }, [tracks]);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading && hasNext) {
          setPage((p) => p + 1);
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loading, hasNext]);

  const reduxTracks: Track[] = useMemo(
    () =>
      allTracks.map((t) => ({
        id: t.trackId,
        url: t.audio?.audioLink ?? "",
        title: t.basicInfo?.title,
        artist: t.basicInfo?.mainArtists?.[0],
        img: t.image?.imgLink,
        duration: t.durationInSeconds,
      })),
    [allTracks],
  );

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
                <Switch defaultChecked />
              </ConfigProvider>
            </div>
          </div>

          <div>
            {allTracks.map((track) => (
              <div key={track.trackId} className="flex-none mb-4">
                <PopoverProvider>
                  <FeedHeader
                    artistName={
                      track.basicInfo?.mainArtists?.[0] || "Unknown Artist"
                    }
                    followCount={Math.floor(Math.random() * 10000)}
                    profileImgLink="https://xsgames.co/randomusers/avatar.php?g=pixel&f=male"
                    location="United States"
                    releaseDate={track.releaseDate}
                  />
                </PopoverProvider>
                <WaveformCard
                  img={track.image?.imgLink}
                  title={track.basicInfo?.title}
                  artist={track.basicInfo?.mainArtists?.[0]}
                  trackId={track.trackId}
                  trackUrl={track.audio?.audioLink}
                  duration={track.durationInSeconds}
                  likeCount={track.numLikes}
                  repostCount={track.numReposts}
                  isLikedByUser={track.isLikedByUser}
                  allTracks={reduxTracks}
                />
              </div>
            ))}
          </div>

          <div ref={sentinelRef} />

          {loading && page > 1 && (
            <div className="flex justify-center py-8">
              <ConfigProvider
                theme={{ token: { colorPrimary: "var(--inferno)" } }}
              >
                <Spin indicator={<LoadingOutlined spin />} size="large" />
              </ConfigProvider>
            </div>
          )}

          {!hasNext && !loading && allTracks.length > 0 && (
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
