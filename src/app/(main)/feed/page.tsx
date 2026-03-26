import WaveformCard from "@/components/layout/track-cards/WaveformCard";
import SausageWaveform from "@/components/ui/SausageWaveform";
import WaveformTest from "@/components/WaveformTest";
import { main } from "framer-motion/m";
import { Metadata } from "next";
import { Main } from "next/document";
// import Script from "next/script";
import { ConfigProvider, Switch } from "antd";
export const metadata: Metadata = {
  title: "Your feed on BeatZa",
};

export default function Feed() {
  return (
    <div className="flex justify-between">
      <div className="w-full md:w-[68%]">
        <ConfigProvider
          theme={{
            components: {
              Switch: {
                colorPrimary: "#ff7f34", // color when ON
                colorPrimaryHover: "#ff5836", // color on hover when ON
              },
            },
          }}
        >
          <Switch />
        </ConfigProvider>
        <WaveformCard />
      </div>

      <div className="hidden md:block md:w-[27.75%]"></div>
    </div>
  );
}
