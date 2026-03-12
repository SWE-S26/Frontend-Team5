"use client"
import { usePathname } from "next/navigation"
import TabsButton from "@/components/ui/TabsButton";
import { PencilIcon, ShareIcon } from "@heroicons/react/24/solid";
import { LuShare } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";

import Album from "./Album";

type Props = {
  activeTab: string
  setActiveTab: (tab: string) => void
}


export default function TabsNavBar({ activeTab, setActiveTab }: Props) {
    const pathname = usePathname()

  return (
    <div className="flex items-center justify-between text-white py-6 px-1">
     
      <div className="flex space-x-6">
       <TabsButton onClick={() => setActiveTab("all")} href="" label="All" pathname={pathname} textSize="text-md" isActiveb={activeTab === "all"}/>
       <TabsButton onClick={() => setActiveTab("popular tracks")} href="" label="Popular tracks" pathname={pathname} textSize="text-md" isActiveb={activeTab === "popular tracks"}/>
       <TabsButton onClick={() => setActiveTab("tracks")} href="" label="Tracks" pathname={pathname} textSize="text-md" isActiveb={activeTab === "tracks"}/>
       <TabsButton onClick={() => setActiveTab("albums")} href="" label="Albums" pathname={pathname} textSize="text-md" isActiveb={activeTab === "albums"}/>
       <TabsButton onClick={() => setActiveTab("playlists")} href="" label="Playlists" pathname={pathname} textSize="text-md" isActiveb={activeTab === "playlists"}/>
       <TabsButton onClick={() => setActiveTab("reposts")} href="" label="Reposts" pathname={pathname} textSize="text-md" isActiveb={activeTab === "reposts"}/>
      </div>

      
      <div className="flex space-x-2">
       

        <button className="relative group p-2 rounded-md bg-[#1F1F1F] transition flex items-center justify-center px-4 py-1 cursor-pointer hover:text-silver">
        <LuShare className="w-4 h-4 " />
        <span className="ml-1 text-sm font-bold px-1 font-semibold">Share</span>

        <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md bg-[#2C2C2C] text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none shadow-lg z-50">
            Share
        </span>
        </button>

        <button className="relative group p-2 rounded-md bg-[#1F1F1F] transition flex items-center justify-center cursor-pointer hover:text-silver">
        <MdOutlineEdit className="w-5 h-5" />
        <span className="ml-1 text-sm font-bold px-1 font-semibold">Edit</span>

        
        <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md bg-[#2C2C2C] text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none shadow-lg z-50">
            Edit
        </span>
        </button>
        
      </div>
    </div>
  );
}