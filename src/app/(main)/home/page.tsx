
import { Metadata } from "next";
import MediaCardCarousel from "@/components/layout/track-cards/MediaCardCarousel";
import SuggestedWrapper from "@/components/social-graph/SuggestedWrapper"
export const metadata: Metadata = {
  title: "Discover the top streamed music and songs online on BeatZa",
};

export default function Home() {
  return (
    <div className="flex justify-between">
      <div className="w-full md:w-[68%]">
        <MediaCardCarousel />
        <MediaCardCarousel />
      </div>

      <div className="hidden md:block md:w-[27.75%]">
        <MediaCardCarousel />
        <SuggestedWrapper />
      </div>
    </div>
  );
}
