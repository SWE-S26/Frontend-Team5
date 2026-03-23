"use client"
import { useState } from "react"

import ProfileHeader from "@/components/profile/profile-header/ProfileHeader";
import ProfileSideBar from "@/components/profile/side-bar/ProfileSideBar";

import { LuShare } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";

import SharePopup from "@/components/profile/SharePopUp";
import ProfileEditForm from "@/components/profile/ProfileEditForm";

/* Tabs */
import EmptyTab from "@/components/profile/profile-tabs/EmptyTab";
import TabsNavbar from "@/components/layout/navbar/TabsNavbar";
import All from "@/components/profile/profile-tabs/All";
import PopularTracks from "@/components/profile/profile-tabs/PopularTracks";
import Tracks from "@/components/profile/profile-tabs/Tracks";
import Albums from "@/components/profile/profile-tabs/Albums";
import Playlists from "@/components/profile/profile-tabs/Playlists";
import Reposts from "@/components/profile/profile-tabs/Reposts";

interface Props {
  params: {
    username: string;
  };
}


const ProfilePage = ({ params }: Props) => {
  const [open, setOpen] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const profileTabs = [
    { href: "", label: "All", value: "all" },
    { href: "", label: "Popular tracks", value: "popular tracks" },
    { href: "", label: "Tracks", value: "tracks" },
    { href: "", label: "Albums", value: "albums" },
    { href: "", label: "Playlists", value: "playlists" },
    { href: "", label: "Reposts", value: "reposts" },
  ];
  
  const [activeTab, setActiveTab] = useState("all")
  const all: any[] = [] // mock data
  const popular: any[] = [] // mock data
  const tracks: any[] = [] // mock data
  // const albums: any[] = [] // mock data
  const playlists: any[] = [] // mock data
  const reposts: any[] = [] // mock data

  const albums = [
  {
    album_id: "1",
    artist: {
      username: "aseem",
      display_name: "Aseem"
    },
    release_date: "2024-01-01",
    tracks: [],
    num_of_likes: 20,
    num_of_reposts: 5,
    type: "album"
  }
]

  return (
    <div>
      <ProfileHeader />
      <div className="flex items-center justify-between mb-4">
        <TabsNavbar tabs={profileTabs} activeTab={activeTab} onTabChange={setActiveTab}
          textSize="text-md" className="flex items-center justify-between text-white py-6 px-1" tabsWrapperClassName="flex space-x-6"/>
        <div className="flex space-x-2">
          <button onClick={() => setOpen(!open)} className="relative group p-2 rounded-md bg-[#1F1F1F] transition flex items-center justify-center px-4 py-1 cursor-pointer hover:text-silver h-10">
            <LuShare className="w-4 h-4 " />
            <span className="ml-1 text-sm font-bold px-1">Share</span>

            <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md bg-[#2C2C2C] text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none shadow-lg z-50">
                Share
            </span>
          </button>
          <SharePopup isOpen={open} onClose={() => setOpen(false)} />

          <button onClick={() => setOpenEdit(true)} className="relative group p-2 rounded-md bg-[#1F1F1F] transition flex items-center justify-center cursor-pointer hover:text-silver h-10">
            <MdOutlineEdit className="w-5 h-5" />
            <span className="ml-1 text-sm font-bold px-1">Edit</span>

            
            <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md bg-[#2C2C2C] text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none shadow-lg z-50">
                Edit
            </span>
          </button>
          <ProfileEditForm
            isOpen={openEdit}
            onClose={() => setOpenEdit(false)}
          />
          
        </div>
      </div>


      <div className="flex justify-between">
        <div className="w-[68%]">

          <div className="mt-10">
            {activeTab === "all" &&
              (all.length === 0 ? <EmptyTab /> : <All />)}

            {activeTab === "popular tracks" &&
              (popular.length === 0 ? <EmptyTab /> : <PopularTracks />)}

            {activeTab === "tracks" &&
              (tracks.length === 0 ? <EmptyTab /> : <Tracks />)}

            {activeTab === "albums" &&
              (albums.length === 0 ? <EmptyTab /> : <Albums />)}

            {activeTab === "playlists" &&
              (playlists.length === 0 ? (
                <h2 className="font-bold text-lg flex items-center justify-center text-center">
                  You haven’t created any playlists.
                </h2>
              ) : (
                <Playlists />
              ))}

            {activeTab === "reposts" &&
              (reposts.length === 0 ? (
                <h2 className="font-bold text-lg flex items-center justify-center text-center">
                  You haven’t reposted any sounds.
                </h2>
              ) : (
                <Reposts />
              ))}
          </div>

        </div>

        <div className="w-[27.75%]">
          <ProfileSideBar/>
        </div>
      </div>


      
    </div>
  )
}

export default ProfilePage