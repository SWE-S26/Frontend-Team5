import { Metadata } from "next"
import MediaCardCarousel from "@/components/layout/MediaCardCarousel";
export const metadata: Metadata = {
  title: "Discover the top streamed music and songs online on BeatZa",
}

export default function Home() {
  return (
    <div className="flex justify-between">

      <div className="w-[68%]">
        <h1>Home</h1>
        <MediaCardCarousel />
        <MediaCardCarousel />
      </div>
      
      <div className="w-[27.75%]">
        <MediaCardCarousel />
      </div>
    
    </div>
  )
}