"use client"
import { PiInfo } from "react-icons/pi";
import TabsButton from "../ui/TabsButton";
import TabsNavbar from "@/components/layout/navbar/TabsNavbar"
import { use, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTrack } from "@/store/slices/trackSlice";
import { Avatar, Tooltip } from "antd";
import {  Popover, Button } from "antd";
import { BsFillPersonFill } from "react-icons/bs";

export default function TrackSidebar() {
    const LikesCount = useAppSelector((state) => state.track.likesCount)
    const RepostsCount = useAppSelector((state) => state.track.repostsCount)

    const [activeTab, setActiveTab] = useState("top");
    const SideTabs = [
  { href: "", label: "Top",            value: "top"            },
  { href: "", label: "First", value: "first" },
  
]
const users = [
  { name: "Jumana", img: "https://i.pravatar.cc/150?img=1" },
  { name: "Ali", img: "https://i.pravatar.cc/150?img=2" },
  { name: "Sara", img: "https://i.pravatar.cc/150?img=3" },
  { name: "Omar", img: "https://i.pravatar.cc/150?img=4" },
  { name: "Lina", img: "https://i.pravatar.cc/150?img=5" },
];
  return (
    <aside className="w-[340px] sticky top-20 h-fit flex flex-col gap-10 text-white">
      
     
      <section className="flex flex-col gap-3 mt-5">

        <div className="flex">
        <h2 className="text-sm font-bold uppercase tracking-wide text-white">
          Fans 
        </h2>
        <PiInfo className="mt-0.5 ml-1"></PiInfo>
        </div>

        {/* Tabs */}
        <div className="flex text-sm pb-2">
          <TabsNavbar
                tabs={SideTabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                textSize="text-md"
                className="flex  text-white-smoke  "
                tabsWrapperClassName="flex space-x-2"
            />
        </div>

        
        <p className="text-sm text-gray-400">
        {activeTab === "top"
            ? "Fans who have played this track the most:"
            : "Fans who played this track in the first 7 days:"}
        </p>

        {/* List placeholder */}
        <div className="flex flex-col gap-3 mt-2">
          {/* FAN ITEM */}
          <div className="h-6 bg-white/5 rounded animate-pulse" />
          <div className="h-6 bg-white/5 rounded animate-pulse" />
          <div className="h-6 bg-white/5 rounded animate-pulse" />
        </div>
      </section>

      {/* RELATED TRACKS */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase text-white">
            Related Tracks
          </h2>
          <button className="text-xs text-gray-500 hover:text-white cursor-pointer">
            View all
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {/* TRACK ITEM PLACEHOLDER */}
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 bg-white/10 rounded" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-3 w-32 bg-white/10 rounded" />
              <div className="h-3 w-20 bg-white/10 rounded" />
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 bg-white/10 rounded" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-3 w-32 bg-white/10 rounded" />
              <div className="h-3 w-20 bg-white/10 rounded" />
            </div>
          </div>
        </div>
      </section>

      {/* ALBUMS */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase text-white">
            In Albums
          </h2>
          <button className="text-xs text-gray-500 hover:text-white cursor-pointer">
            View all
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div className="h-10 bg-white/5 rounded animate-pulse" />
          <div className="h-10 bg-white/5 rounded animate-pulse" />
        </div>
      </section>

      {/* PLAYLISTS */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase text-white">
            In Plyalists
          </h2>
          <button className="text-xs text-gray-500 hover:text-white cursor-pointer">
            View all
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div className="h-10 bg-white/5 rounded animate-pulse" />
          <div className="h-10 bg-white/5 rounded animate-pulse" />
        </div>
      </section>

      {/* Likes */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase text-white">
            {LikesCount}  Likes
          </h2>
          <button className="text-xs text-gray-500 hover:text-white cursor-pointer">
            View all
          </button>
        </div>

        
<Avatar.Group className="w-100 ">
  {users.map((user, index) => (
    <Popover
      key={index}
      trigger="hover"
      placement="top"
      overlayInnerStyle={{
        backgroundColor: "#111",
        borderRadius: "8px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
        padding: 0,
        overflow: "hidden",  // ← clips the avatar to card edges
        border: "1px solid #303030",
      }}
      
      content={
        <div
          style={{
            width: 200,
            textAlign: "center",
            color: "#fff",
            padding: "20px 16px 16px",
            backgroundColor: "#111",
          }}
        >
          <Avatar
            src={user.img}
            size={110}
            style={{
              marginBottom: 12,
             
            }}
          />
          <div style={{ fontWeight: 600, fontSize: 15 }}>{user.name}</div>

          

          {/* Follower count row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              margin: "10px 0",
              fontSize: 13,
              color: "#aaa",
            }}
          >
            <BsFillPersonFill className="w-5 h-5" />
            
          </div>

          <div className="  bold mb-4 font-bold">Country</div>

          <Button
            style={{
              width: "100%",
              borderRadius: 8,
              backgroundColor: "#fff",
              color: "#000",
              fontWeight: 600,
              border: "none",
              height: 36,
            }}
          >
            Follow
          </Button>
        </div>
      }
    >
      <Avatar src={user.img} size={48} style={{ cursor: "pointer" }} />
    </Popover>
  ))}
</Avatar.Group>
        
      </section>

      {/* Reposts*/}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase text-white">
            {RepostsCount}  Reposts
          </h2>
          <button className="text-xs text-gray-500 hover:text-white cursor-pointer">
            View all
          </button>
        </div>

      </section>

      

    </aside>
  );
}