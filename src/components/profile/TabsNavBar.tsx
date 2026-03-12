"use client"
import { usePathname } from "next/navigation"
import TabsButton from "@/components/ui/TabsButton";

import Album from "./profile-tabs/Albums";

type Props = {
  activeTab: string
  className ? : string
  setActiveTab: (tab: string) => void
}


export default function TabsNavBar({ activeTab, setActiveTab, className }: Props) {
    const pathname = usePathname()

  return (
    <div className={`flex items-center justify-between text-white py-6 px-1 ${className}`}>
     
      <div className="flex space-x-6">
       <TabsButton onClick={() => setActiveTab("all")} href="" label="All" pathname={pathname} textSize="text-md" isActiveb={activeTab === "all"}/>
       <TabsButton onClick={() => setActiveTab("popular tracks")} href="" label="Popular tracks" pathname={pathname} textSize="text-md" isActiveb={activeTab === "popular tracks"}/>
       <TabsButton onClick={() => setActiveTab("tracks")} href="" label="Tracks" pathname={pathname} textSize="text-md" isActiveb={activeTab === "tracks"}/>
       <TabsButton onClick={() => setActiveTab("albums")} href="" label="Albums" pathname={pathname} textSize="text-md" isActiveb={activeTab === "albums"}/>
       <TabsButton onClick={() => setActiveTab("playlists")} href="" label="Playlists" pathname={pathname} textSize="text-md" isActiveb={activeTab === "playlists"}/>
       <TabsButton onClick={() => setActiveTab("reposts")} href="" label="Reposts" pathname={pathname} textSize="text-md" isActiveb={activeTab === "reposts"}/>
      </div>

    </div>
  );
}