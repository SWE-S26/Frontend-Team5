import WaveformCard from "@/components/layout/track-cards/WaveformCard";
import SausageWaveform from "@/components/ui/SausageWaveform";
import WaveformTest from "@/components/WaveformTest";
import { main } from "framer-motion/m";
import { Metadata } from "next";
import { Main } from "next/document";
import Script from "next/script";
export const metadata: Metadata = {
  title: "Your feed on BeatZa",
};

export default function Feed() {
  return (
    <div className="flex justify-between">
      <div className="w-full md:w-[68%]">
        <WaveformCard />
      </div>

      <div className="hidden md:block md:w-[27.75%]"></div>
    </div>
  );
}
