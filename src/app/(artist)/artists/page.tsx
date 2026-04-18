"use client";
import { useState } from "react";
import ArtistSidebar from "@/components/artist-studio/ArtistSidebar";
import ArtistTopbar from "@/components/artist-studio/ArtistTopbar";
import ArtistStudioContent, { ArtistTab } from "@/components/artist-studio/ArtistStudioContent";
import PlayerBar from "@/components/layout/player/PlayerBar";

export default function Artists() {
  const [activeTab, setActiveTab] = useState<ArtistTab>("tracks");

  return (
    <div className="min-h-screen bg-[#111] pb-20">
      <ArtistSidebar />
      <ArtistTopbar />
      <main className="ml-16.5 mt-14">
        <ArtistStudioContent activeTab={activeTab} onChangeTab={setActiveTab} />
      </main>
      <PlayerBar />
    </div>
  );
}