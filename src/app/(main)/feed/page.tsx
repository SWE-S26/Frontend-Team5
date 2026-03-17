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
    <>
      <Script src="/scripts/waveform.js" strategy="beforeInteractive" />
      <h1>Feed</h1>
      <WaveformTest />
    </>
  );
}
