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
      <div className="w-[68%]">
        <h1>Feed</h1>
        <SausageWaveform />
      </div>

      <div className="w-[27.75%]"></div>
    </div>
  );
}
