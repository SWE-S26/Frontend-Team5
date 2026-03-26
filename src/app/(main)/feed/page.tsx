import WaveformCard from "@/components/layout/track-cards/WaveformCard";
import { main } from "framer-motion/m";
import { Metadata } from "next";
import { Main } from "next/document";
import { ConfigProvider, Switch } from "antd";

export const metadata: Metadata = {
  title: "Your feed on BeatZa",
};

export default function Feed() {
  return (
    <div className="flex justify-between">
      <div className="w-full md:w-[68%]">
        {/* Top Div */}
        <div className="flex items-center mb-4">
          <h2 className="flex-1 text-[22px] font-bold text-white-smoke">
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
                    colorPrimary: "var(--crusta)",
                    colorPrimaryHover: "var(--crusta)",
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

        <WaveformCard />
      </div>

      <div className="hidden md:block md:w-[27.75%]"></div>
    </div>
  );
}
