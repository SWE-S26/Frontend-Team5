"use client"
import { useState } from "react"

import ProfileHeader from "@/components/profile/profile-header/ProfileHeader";
import ProfileSideBar from "@/components/profile/side-bar/ProfileSideBar";

import { LuShare } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";

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
     
      
    </div>
  )
}

export default ProfilePage