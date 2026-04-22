"use client";

import { useEffect, useMemo } from "react";
import { ConfigProvider, Switch } from "antd";

import WaveformCard from "@/components/layout/track-cards/WaveformCard";
import FeedHeader from "@/components/layout/track-cards/FeedHeader";
import { PopoverProvider } from "@/components/layout/track-cards/PopoverContext";
import FeedGuard from "./FeedGuard";

import { useGetTracks } from "@/hooks/useTracks";
import { Track } from "@/store/slices/playerSlice";

export default function Feed() {
  const { getTracks, loading, error, tracks } = useGetTracks();

  useEffect(() => {
    getTracks(1, 10);
  }, [getTracks]);

  const reduxTracks: Track[] = useMemo(
    () =>
      (tracks ?? []).map((t) => ({
        id: t._id,
        url: t.audio?.audioLink ?? "",
        title: t.basicInfo?.title,
        artist: t.basicInfo?.mainArtists?.[0],
        img: t.image?.imgLink,
        duration: t.durationInSeconds,
      })),
    [tracks],
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
            {tracks?.map((track) => (
              <div key={track._id} className="flex-none mb-4">
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
                  trackId={track._id}
                  trackUrl={track.audio?.audioLink}
                  duration={track.durationInSeconds}
                  allTracks={reduxTracks}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="hidden md:block md:w-[27.75%]" />
      </div>
    </FeedGuard>
  );
}
