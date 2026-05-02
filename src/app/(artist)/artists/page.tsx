"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ArtistSidebar from "@/components/artist-studio/ArtistSidebar";
import ArtistTopbar from "@/components/artist-studio/ArtistTopbar";
import ArtistStudioContent, { ArtistTab } from "@/components/artist-studio/ArtistStudioContent";
import PlayerBar from "@/components/layout/player/PlayerBar";

export default function Artists() {
  const [activeTab, setActiveTab] = useState<ArtistTab>("tracks");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-chinese-black pb-20">
      <ArtistSidebar open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <ArtistTopbar onSidebarToggle={() => setIsSidebarOpen((open) => !open)} />
      <main className="mt-14 ml-0 lg:ml-20">
        <ArtistStudioContent key={pathname} activeTab={activeTab} onChangeTab={setActiveTab} />
      </main>
    </div>
  );
}