import FeedGuard from "./FeedGuard";
import WaveformCard from "@/components/layout/track-cards/WaveformCard";
import { Metadata } from "next";
import { ConfigProvider, Switch } from "antd";
import FeedHeader from "@/components/layout/track-cards/FeedHeader";
import { PopoverProvider } from "@/components/layout/track-cards/PopoverContext";

export const metadata: Metadata = {
  title: "Your feed on BeatZa",
};

export default function Feed() {
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

          <PopoverProvider>
            <FeedHeader />
          </PopoverProvider>

          <WaveformCard />
        </div>

        <div className="hidden md:block md:w-[27.75%]"></div>
      </div>
    </FeedGuard>
  );
}