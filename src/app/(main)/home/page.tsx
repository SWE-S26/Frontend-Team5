import { Metadata } from "next"
import MediaCardCarousel from "@/components/layout/MediaCardCarousel";
export const metadata: Metadata = {
  title: "Discover the top streamed music and songs online on BeatZa",
}

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <MediaCardCarousel />
      <MediaCardCarousel />
      <MediaCardCarousel />
      <MediaCardCarousel />

    </div>
  )
}