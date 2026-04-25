"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import ArtistSidebar from "@/components/artist-studio/ArtistSidebar";
import ArtistTopbar from "@/components/artist-studio/ArtistTopbar";
import ArtistStudioContent, { ArtistTab } from "@/components/artist-studio/ArtistStudioContent";
import PlayerBar from "@/components/layout/player/PlayerBar";

export default function Artists() {
  const [activeTab, setActiveTab] = useState<ArtistTab>("tracks");

  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-chinese-black pb-20">
      <ArtistSidebar />
      <ArtistTopbar />
      <main className="ml-16.5 mt-14">
        <ArtistStudioContent key={pathname} activeTab={activeTab} onChangeTab={setActiveTab} />
      </main>
      <PlayerBar />
    </div>
  );
}