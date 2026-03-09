"use client"
import { usePathname } from "next/navigation"
import TabsButton from "@/components/ui/TabsButton";
import { PencilIcon, ShareIcon } from "@heroicons/react/24/solid";
import { LuShare } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";


export default function Navbar() {
    const pathname = usePathname()

  return (
    <div className="flex items-center justify-between text-white py-6 px-1">
     
      <div className="flex space-x-6">
       <TabsButton href="" label="All" pathname={pathname} textSize="text-md"/>
       <TabsButton href="" label="Popular tracks" pathname={pathname} textSize="text-md"/>
       <TabsButton href="" label="Tracks" pathname={pathname} textSize="text-md"/>
       <TabsButton href="" label="Albums" pathname={pathname} textSize="text-md"/>
       <TabsButton href="" label="Playlists" pathname={pathname} textSize="text-md"/>
       <TabsButton href="" label="Reposts" pathname={pathname} textSize="text-md"/>
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